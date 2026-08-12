import * as XLSX from 'xlsx';
import * as moment from 'moment';

import {Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {
    GetParameters,
    ImportCompleted,
    ImportPromotion,
    ImportingPromotionBonusGiftAmount,
    ImportingPromotionBonusGiftQuantity,
    ImportingPromotionFinalPrice,
    ImportingPromotionScale,
    ResetImport
} from '@shared/action';
import {Observable, Subject, takeUntil} from 'rxjs';
import {PrepareOption, Promotion} from '@shared/interface';
import {Select, Store} from '@ngxs/store';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '@shared/services/index.service';
import {OptionalAll} from '@shared/types/util.types';
import {ParameterService} from '@shared/services/parameter.service';
import {PromotionState} from '@shared/state/promotion.state';

@Component({
    selector: 'app-upload-promotion',
    templateUrl: './upload-promotion.component.html',
    styles: ``
})
export class UploadPromotionComponent implements OnInit, OnDestroy {

    @ViewChild("uploadPromotionModal", {static: false}) UploadPromotionModal: TemplateRef<string>;

    @Select(PromotionState.completed) completed$: Observable<boolean>
    @Select(PromotionState.importingScale) importingScale$: Observable<boolean>
    @Select(PromotionState.importingFinalPrice) importingFinalPrice$: Observable<boolean>
    @Select(PromotionState.importingBonusGiftQuantity) importingBonusGiftQuantity$: Observable<boolean>
    @Select(PromotionState.importingBonusGiftAmount) importingBonusGiftAmount$: Observable<boolean>

    importing: boolean = false


    @Output() opened = new EventEmitter<boolean>();

    public modalOpen: boolean = false;

    fileFinalPrice: File
    fileGiftOneItem: File
    fileScale: File

    private destroy$ = new Subject<void>();


    constructor(
        private modalService: NgbModal,
        private parameterService: ParameterService,
        private store: Store,
        private notificationService: NotificationService,
    ) {
        this.store.dispatch(new GetParameters({key: 'ecommerce'}));
        this.store.dispatch(new GetParameters({key: 'division'}));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnInit(): void {

        this.store.dispatch(new ResetImport())


        this.importingScale$.pipe(takeUntil(this.destroy$)).subscribe((importing) => {
            if (this.importing === true && importing === false) {
                this.prepareFileFinalPrice()
            }
        })

        this.importingFinalPrice$.pipe(takeUntil(this.destroy$)).subscribe((importing) => {
            if (this.importing === true && importing === false) {
                this.prepareFileBonusGiftQuantity()
            }
        })

        this.importingBonusGiftQuantity$.pipe(takeUntil(this.destroy$)).subscribe((importing) => {
            if (this.importing === true && importing === false) {
                this.prepareFileBonusGiftAmount()
            }
        })

        this.importingBonusGiftAmount$.pipe(takeUntil(this.destroy$)).subscribe((importing) => {

            if (this.importing === true && importing === false) {
                this.store.dispatch(new ImportCompleted(true))
                this.importing = false
                this.notificationService.showSuccess('Ha finalizado la importación de promociones')
            }

        })


    }

    async openModal() {
        this.modalOpen = true;
        this.modalService.open(this.UploadPromotionModal, {
            ariaLabelledBy: 'shipping-rule-Modal',
            centered: true,
            backdrop: 'static',
            windowClass: 'theme-modal shipping-rule-modal modal-lg'
        }).result.then((result) => {
            console.log(result)
        }, (reason) => {
            console.log(reason)
        });
    }

    onSelectedFinalPrice(file: File[] | File) {
        this.fileFinalPrice = file as File
    }

    onSelectedGiftOneItem(file: File[] | File) {
        this.fileGiftOneItem = file as File
    }

    onSelectedScale(file: File[] | File) {
        this.fileScale = file as File
    }


    private readExcelFile(file: File, groupByColumnsIndexes: number[], extra?: {
        sheeIndex?: number,
        ignoreFirstRow: boolean
    }): Promise<any[][]> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                const data = e.target.result;
                if (data instanceof ArrayBuffer) {
                    const workbook = XLSX.read(new Uint8Array(data), {type: 'array'});
                    const sheetName = extra?.sheeIndex ? workbook.SheetNames[extra?.sheeIndex] : workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    if (!worksheet) {
                        reject(new Error(`La pestaña '${sheetName}' no se encontró en el archivo Excel.`));
                        return;
                    }
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: false, dateNF: 'dd/mm/yyyy'});

                    if (extra?.ignoreFirstRow) {
                        jsonData.shift()
                    }

                    const groupedRows = this.groupRowsByColumns(jsonData, groupByColumnsIndexes);

                    resolve(groupedRows);
                } else {
                    reject(new Error('El archivo no pudo ser leído correctamente.'));
                }
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsArrayBuffer(file);
        });
    }

    private groupRowsByColumns(rows: any[], groupByColumnsIndexes: number[]): any[][] {
        const groupedRows: any[][] = [];
        const groupMap = new Map<string, any[]>();
        rows.forEach((row) => {
            const groupKey = groupByColumnsIndexes.map(index => row[index]).join('-');
            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, []);
            }
            groupMap.get(groupKey)?.push(row);
        });
        groupMap.forEach((value) => {
            groupedRows.push(value);
        });
        return groupedRows;
    }


    /**
     *
     * @param ecommerce can be a string with the values separated by commas : '1,2,3' (item[0][7] / item[0][6] / .... )
     * @private
     */
    /*
    private getEcommerceKeys(ecommerces: string): string[] | null {
        const ecommerce = ecommerces ? ecommerces.split(',').map((item) => Number(item)) : null
        let ecommerceKeys = this.parameterService.getOtherByValue(ecommerce, 'ecommerce')
        ecommerceKeys = Array.isArray(ecommerceKeys) && ecommerceKeys.length > 0 ? ecommerceKeys : null
        return ecommerceKeys
    }
    */
    private getEcommerceKeys(_ecommerce: string): string {
        const ecommerce = Number(_ecommerce)
        let ecommerceKeys = this.parameterService.getOtherByValue(ecommerce, 'ecommerce').at(0)
        ecommerceKeys = Array.isArray(ecommerceKeys) && ecommerceKeys.length > 0 ? ecommerceKeys : null
        return ecommerceKeys || null
    }


    private getDivisionKeys(divisions: string): string[] | null {
        const division = divisions ? divisions.split(',').map((item) => Number(item)) : null
        let divisionKeys = this.parameterService.getOtherByValue(division, 'division')
        divisionKeys = Array.isArray(divisionKeys) && divisionKeys.length > 0 ? divisionKeys : null
        return divisionKeys
    }


    private prepareFileScale() {
        if (!this.fileScale) {
            this.store.dispatch(new ImportingPromotionScale(true))
            setTimeout(() => {
                this.store.dispatch(new ImportingPromotionScale(false))
            }, 500)
            return
        }
        this.readExcelFile(this.fileScale, [0, 1], {ignoreFirstRow: true}).then((data) => {

            if (data) {

                const promotions: OptionalAll<Promotion>[] = data.map((item) => {

                    const ecommerceKeys = this.getEcommerceKeys(item[0][7])
                    const divisionKeys = this.getDivisionKeys(item[0][1])

                    const products: OptionalAll<PrepareOption>[] = item.map((product) => {
                        return {
                            code: 0,
                            discount: Number(product[4]),
                            item: 0,
                            name: null,
                            quantity: 0,
                            quantity_max: Number(product[3]),
                            quantity_min: Number(product[2]),
                            reference: product[0]
                        }
                    })

                    const promotion: OptionalAll<Promotion> = {
                        amount: null,
                        availability_end: moment(item[0][6], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        availability_start: moment(item[0][5], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        code: null,
                        condition_promotion: 0,
                        //ecommerce: ecommerceKeys,
                        new_customer: (item[0][8] && Number(item[0][8]) === 1) ? 'yes' : 'no',
                        reference: null,
                        status: 'active',
                        type: 'escala',
                        type_division: divisionKeys,
                        products: products,

                    }
                    return promotion
                })

                this.store.dispatch(new ImportingPromotionScale(true))
                this.store.dispatch(new ImportPromotion({
                    items: promotions,
                    type: 'escala',
                }))
            }

        }).catch((error) => {
            console.error(error)
        })
    }

    private prepareFileFinalPrice() {
        if (!this.fileFinalPrice) {
            this.store.dispatch(new ImportingPromotionFinalPrice(true))
            setTimeout(() => {
                this.store.dispatch(new ImportingPromotionFinalPrice(false))
            }, 500)
            return
        }

        this.readExcelFile(this.fileFinalPrice, [0, 1], {ignoreFirstRow: true}).then((data) => {
            if (data) {
                const promotions: OptionalAll<Promotion>[] = data.map((item) => {

                    const ecommerceKeys = this.getEcommerceKeys(item[0][6])
                    const divisionKeys = this.getDivisionKeys(item[0][1])

                    const products: OptionalAll<PrepareOption>[] = item.map((product) => {
                        return {
                            code: 0,
                            discount: Number(product[3]),
                            item: 0,
                            name: null,
                            quantity: 0,
                            quantity_max: 0,
                            quantity_min: Number(product[2]),
                            reference: product[0]
                        }
                    })

                    const promotion: OptionalAll<Promotion> = {
                        amount: null,
                        availability_end: moment(item[0][5], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        availability_start: moment(item[0][4], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        code: null,
                        condition_promotion: 0,
                        ecommerce: ecommerceKeys,
                        new_customer: (item[0][7] && Number(item[0][7]) === 1) ? 'yes' : 'no',
                        reference: null,
                        status: 'active',
                        type: 'precio-final',
                        type_division: divisionKeys,
                        products: products,

                    }
                    return promotion
                })

                this.store.dispatch(new ImportingPromotionFinalPrice(true))
                this.store.dispatch(new ImportPromotion({
                    items: promotions,
                    type: 'precio-final',
                }))
            }

        }).catch((error) => {
            console.error(error)
        })
    }

    private prepareFileBonusGiftQuantity() {

        if (!this.fileGiftOneItem) {
            this.store.dispatch(new ImportingPromotionBonusGiftQuantity(true))
            setTimeout(() => {
                this.store.dispatch(new ImportingPromotionBonusGiftQuantity(false))
            }, 500)
            return
        }

        this.readExcelFile(this.fileGiftOneItem, [0, 2], {ignoreFirstRow: true, sheeIndex: 0}).then((data) => {
            if (data) {
                const promotions: OptionalAll<Promotion>[] = data.map((item) => {

                    const ecommerceKeys = this.getEcommerceKeys(item[0][7])
                    const divisionKeys = this.getDivisionKeys(item[0][2])

                    const products: OptionalAll<PrepareOption>[] = item.map((product) => {
                        return {
                            code: 0,
                            //  El regalo siempre es gratis: la columna de descuento del Excel se ignora
                            //  a propósito. Antes entraba tal cual y sin validar (el form la limita a
                            //  99.99, la importación no), así que una fila con otro valor terminaba
                            //  cobrándole al cliente un producto anunciado como regalo.
                            discount: 100,
                            item: 0,
                            name: null,
                            //  Umbral de piezas en el carrito que dispara la promoción.
                            quantity: Number(product[3]),
                            quantity_max: 0,
                            quantity_min: 1,
                            reference: product[1]
                        }
                    })

                    const promotion: OptionalAll<Promotion> = {
                        amount: null,
                        availability_end: moment(item[0][6], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        availability_start: moment(item[0][5], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        code: null,
                        condition_promotion: 2,
                        ecommerce: ecommerceKeys,
                        new_customer: (item[0][8] && Number(item[0][8]) === 1) ? 'yes' : 'no',
                        reference: null,
                        status: 'active',
                        type: 'lleva-gratis',
                        type_division: divisionKeys,
                        products: products,

                    }
                    return promotion
                })

                this.store.dispatch(new ImportingPromotionBonusGiftQuantity(true))
                this.store.dispatch(new ImportPromotion({
                    items: promotions,
                    type: 'lleva-gratis',
                    condition: 2
                }))
            }

        }).catch((error) => {
            console.error(error)
        })
    }

    private prepareFileBonusGiftAmount() {
        if (!this.fileGiftOneItem) {
            this.store.dispatch(new ImportingPromotionBonusGiftAmount(true))
            setTimeout(() => {
                this.store.dispatch(new ImportingPromotionBonusGiftAmount(false))
            }, 500)
            return
        }


        this.readExcelFile(this.fileGiftOneItem, [0, 2], {ignoreFirstRow: true, sheeIndex: 1}).then((data) => {
            if (data) {
                const promotions: OptionalAll<Promotion>[] = data.map((item) => {

                    const ecommerceKeys = this.getEcommerceKeys(item[0][6])
                    const divisionKeys = this.getDivisionKeys(item[0][2])

                    const products: OptionalAll<PrepareOption>[] = item.map((product) => {
                        return {
                            code: 0,
                            discount: 0,
                            item: 0,
                            name: null,
                            quantity: 0,
                            quantity_max: 0,
                            quantity_min: 0,
                            reference: product[1],
                            amount: Number(product[5])
                        }
                    })

                    const promotion: OptionalAll<Promotion> = {
                        amount: null,
                        availability_end: moment(item[0][4], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        availability_start: moment(item[0][3], 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        code: null,
                        condition_promotion: 1,
                        ecommerce: ecommerceKeys,
                        new_customer: (item[0][7] && Number(item[0][7]) === 1) ? 'yes' : 'no',
                        reference: null,
                        status: 'active',
                        type: 'lleva-gratis',
                        type_division: divisionKeys,
                        products: products,

                    }
                    return promotion
                })

                this.store.dispatch(new ImportingPromotionBonusGiftAmount(true))
                this.store.dispatch(new ImportPromotion({
                    items: promotions,
                    type: 'lleva-gratis',
                    condition: 1
                }))
            }

        }).catch((error) => {
            console.error(error)
        })
    }

    onImportFiles() {
        if (!this.fileScale && !this.fileFinalPrice && !this.fileGiftOneItem) return

        this.importing = true
        this.store.dispatch(new ImportCompleted(false))
        this.prepareFileScale()
    }

    onCloseModal() {
        this.destroy$.next();
        this.destroy$.complete();
        this.opened.emit(false)
        this.modalService.dismissAll()
    }


}
