import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewChecked, Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CreatePromotion, EditPromotion, UpdatePromotion } from '@shared/action/promotion.action';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, delay, forkJoin, mergeMap, of, switchMap, takeUntil, tap } from 'rxjs';
import { OptionalAll, TypeForm } from '@shared/types/util.types';
import { PrepareOption, PromotionProductForm } from '@shared/interface/promotion.interface';
import { IActionModal, PromotionForm, Select2DataFormat, TableConfig } from '@shared/interface';
import { Select, Store } from '@ngxs/store';

import { FormProductPromotionComponent } from '../form-product-promotion/form-product-promotion.component';
import { FormService } from '@shared/validator/form.service';
import { FormValidator } from '@shared/validator/form-validator';
import { GetParameters } from '@shared/action/parameter.action';
import { NotificationService } from '@shared/services/notification.service';
import { ParameterService } from '@shared/services/parameter.service';
import { ParameterState } from '@shared/state/parameter.state';
import { PromotionState } from '@shared/state/promotion.state';
import { PedidoService } from '@shared/services/pedido.service';
import { PromotionService } from '@shared/services/promotion.service';

@Component({
    selector: 'app-form-promotion',
    templateUrl: './form-promotion.component.html',
    styles: ``
})
export class FormPromotionComponent implements OnInit, OnDestroy {
    @Input() type: TypeForm;
    @ViewChild("FormProductPromotionComponent", { static: false }) formProductPromotionComponent: FormProductPromotionComponent
    @Select(ParameterState.parametersSelect2('type_promotion')) type_promotion$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('ecommerce')) ecommerce$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('division')) division$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('condition_promotion')) condition_promotion$: Observable<Select2DataFormat<string>[]>;

    private destroy$ = new Subject<void>();

    calendar = inject(NgbCalendar);
    displayMonths = 2;
    formatter = inject(NgbDateParserFormatter);
    promosionService = inject(PromotionService);
    fromDate: NgbDate | null;
    hoveredDate: NgbDate | null = null;
    id: number
    model: NgbDateStruct;
    navigation: 'select' | 'arrows' | 'none' = 'select'
    outsideDays: 'visible' | 'hidden' | 'collapsed' = 'visible';
    public form: FormGroup<PromotionForm>
    showWeekNumbers = true;
    toDate: NgbDate | null
    today = inject(NgbCalendar).getToday();
    opened: boolean = false;

    //prepareEcommerce: number[] = []
    prepareEcommerce: number
    prepareType: number
    prepareDivision: number[] = []


    public tableConfigScale: TableConfig = {
        columns: [
            { title: 'promotion_form_table_item', dataField: 'item', colSmall: true },
            { title: 'promotion_form_table_prod_code', dataField: 'reference' },
            { title: 'promotion_form_table_prod_name', dataField: 'name' },
            { title: 'promotion_form_table_min_quantity', dataField: 'quantity_min' },
            { title: 'promotion_form_table_max_quantity', dataField: 'quantity_max' },
            { title: 'promotion_form_table_discount', dataField: 'discount' },
        ],
        rowActions: [
            { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" }
        ],
        data: [],
        total: 0
    }
    
    public tableConfigFinalPrice: TableConfig = {
        columns: [
            { title: 'promotion_form_table_item', dataField: 'item', colSmall: true },
            { title: 'promotion_form_table_prod_code', dataField: 'reference' },
            { title: 'promotion_form_table_prod_name', dataField: 'name' },
            { title: 'promotion_form_table_min_quantity', dataField: 'quantity_min' },
            { title: 'promotion_form_table_discount', dataField: 'discount' },
        ],
        rowActions: [
            { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" },
            { label: "global_edit", actionToPerform: "edit", icon: "ri-edit-line" }
        ],
        data: [],
        total: 0
    }

    
   
    
    public tableConfigBonusGiftAmount: TableConfig = {
        columns: [
            { title: 'promotion_form_table_item', dataField: 'item', colSmall: true },
            { title: 'promotion_form_table_prod_code', dataField: 'reference' },
            { title: 'promotion_form_table_prod_name', dataField: 'name' },
            { title: 'promotion_form_table_amount', dataField: 'amount' },
        ],
        rowActions: [
            { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" }
        ],
        data: [],
        total: 0
    }
    //  "Lleva gratis por cantidad": la cantidad que dispara la promoción es del carrito, no del
    //  producto, así que no se muestra por fila (es la misma para todas, y está arriba en el campo
    //  "Cantidad"). La cant. mínima de la fila es siempre 1: se regala una unidad de cada producto.
    //  Tampoco se muestra descuento porque el regalo siempre va al 100%.
    public tableConfigBonusGiftQuantity: TableConfig = {
        columns: [
            { title: 'promotion_form_table_item', dataField: 'item', colSmall: true },
            { title: 'promotion_form_table_prod_code', dataField: 'reference' },
            { title: 'promotion_form_table_prod_name', dataField: 'name' },
            { title: 'promotion_form_table_min_quantity', dataField: 'quantity_min' },
        ],
        rowActions: [
            { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" }
        ],
        data: [],
        total: 0
    }

    constructor(
        private store: Store,
        private parameterService: ParameterService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
    }


    ngOnInit(): void {
        this.initForm()
        this.initServices()

        this.form.controls.type.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            if (this.opened) return

            this.clearProducts()

            if (value === 1) {
                FormService.setRequiredSpecificFields(this.form, ['condition_promotion'], true)
            } else {
                FormService.setRequiredSpecificFields(this.form, ['condition_promotion'], false)
                FormService.setRequiredSpecificFields(this.form, ['amount', 'quantity'], false)
                this.form.controls.quantity.setValue(null)
                this.form.controls.condition_promotion.setValue(null)
            }
            FormService.updateValueAndValidityForFields(this.form, ['condition_promotion', 'amount', 'quantity'])
            FormService.markFieldsAsTouched(this.form, ['condition_promotion', 'amount', 'quantity'])
        })

        this.form.controls.condition_promotion.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            if (this.opened) return

            if (value === 1) { // Por monto
                this.form.controls.amount.setValidators([Validators.required, FormValidator.AmountValidator])
            } else {
                FormService.setRequiredSpecificFields(this.form, ['amount'], false)
            }

            if (value === 2) { // Por cantidad
                this.form.controls.quantity.setValidators([Validators.required, FormValidator.MinQuantityValidator])
            } else {
                FormService.setRequiredSpecificFields(this.form, ['quantity'], false)
                this.form.controls.quantity.setValue(null)
            }

            FormService.updateValueAndValidityForFields(this.form, ['amount', 'quantity'])
            FormService.markFieldsAsTouched(this.form, ['amount', 'quantity'])
        })

        this.form.controls.amount.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            this.clearProducts()
        })

        this.form.controls.quantity.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            this.clearProducts()
        })

    }

    private clearProducts() {
        (this.form.get('products') as FormArray).clear()
        this.tableConfigScale.data = []
        this.tableConfigFinalPrice.data = []
        this.tableConfigBonusGiftAmount.data = []
        this.tableConfigBonusGiftQuantity.data = []
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.form.get('availability_start').setValue(this.formatter.format(date));
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
            this.toDate = date;
            this.form.get('availability_end').setValue(this.formatter.format(date));
        } else {
            this.toDate = null;
            this.fromDate = date;
            this.form.get('availability_start').setValue(this.formatter.format(date));
            this.form.get('availability_end').setValue(null);
        }
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    checkAvailabilityOpen(): boolean {
        const ecommerce = this.form.getRawValue().ecommerce
        const type = this.getType()
        const condition = this.form.getRawValue().condition_promotion // this.form.controls.condition_promotion.value
        if (!ecommerce) return false
        if (type && (type !== 'lleva-gratis' || (type === 'lleva-gratis' && condition))) return true
        return false
    }

    onShowModal() {
        if (!this.form.getRawValue().ecommerce) {
            this.notificationService.showWarn('Primero seleccione la tienda o el ecommerce', 'Aviso')
            return
        }
        if (!this.checkAvailabilityOpen()) return
        this.opened = true;
        setTimeout(() => {
            this.formProductPromotionComponent.openModal()
             this.formProductPromotionComponent.setId(0);

        })
    }

    onShowModalEdit(code : number) {
        if (!this.form.getRawValue().ecommerce) {
            this.notificationService.showWarn('Primero seleccione la tienda o el ecommerce', 'Aviso')
            return
        }
        if (!this.checkAvailabilityOpen()) return
        this.opened = true;
        setTimeout(() => {
            this.formProductPromotionComponent.openModal()
            this.formProductPromotionComponent.setId(code);

        })
    }

    

    private initServices() {

        const ecommerce$ = this.store.dispatch(new GetParameters({ key: 'ecommerce' }));
        const type_promotion$ = this.store.dispatch(new GetParameters({ key: 'type_promotion' }));
        const division$ = this.store.dispatch(new GetParameters({ key: 'division' }));
        const condition_promotion$ = this.store.dispatch(new GetParameters({ key: 'condition_promotion' }));

        forkJoin([ecommerce$, type_promotion$, division$, condition_promotion$]).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {

                this.route.params
                    .pipe(
                        switchMap(
                            params => {
                                if (!params['id']) return of()
                                return this.store.dispatch(new EditPromotion(params['id'])).pipe(
                                    mergeMap(() => this.store.select(PromotionState.selectedPromotion)))
                            })
                    ).pipe(takeUntil(this.destroy$)).subscribe(promotion => {
                        //  El catalogo (ecommerce$/type_promotion$/division$/condition_promotion$) ya
                        //  esta en el store llegado este punto (el forkJoin de arriba espera la
                        //  respuesta HTTP de las 4, no solo el dispatch), pero el <select2> arma sus
                        //  <option> a partir del binding `[data]="...$ | async"`, que recien se pinta
                        //  en el DOM en el siguiente ciclo de deteccion de cambios. Si `formControlName`/
                        //  `[value]` intentan seleccionar un valor ANTES de que esas opciones existan
                        //  en el DOM, el widget se queda sin nada marcado -- por eso "tipo de tienda" y
                        //  "division" no se rellenaban al editar. Se difiere al proximo macrotask (mismo
                        //  patron que ya usan onShowModal/onShowModalEdit en este archivo) para que la
                        //  seleccion se aplique DESPUES de que el <select2> ya tenga sus opciones.
                        setTimeout(() => {
                            this.id = promotion?.code || 0
                            const type = this.parameterService.getValueByOther(promotion?.type.toString(), 'type_promotion').at(0)
                            //  emitEvent: false -- sin esto, patchValue dispara type.valueChanges (ver
                            //  ngOnInit) ANTES de terminar de aplicar el resto de campos de este mismo
                            //  patchValue, y ese handler resetea condition_promotion/amount/quantity a
                            //  null si el tipo no es "lleva-gratis", pisando el valor que se acaba de
                            //  cargar de la promocion.
                            this.form.patchValue({
                                ...promotion,
                                type: type,
                                amount: promotion?.amount || 0,
                                status: !!(promotion?.status === 'active' || promotion?.status === 1),
                                new_customer: !!(promotion?.new_customer === 'yes' || promotion?.new_customer === 1)
                            }, { emitEvent: false })
                            this.fromDate = promotion?.availability_start ? NgbDate.from(this.formatter.parse(promotion?.availability_start)) : null
                            this.toDate = promotion?.availability_end ? NgbDate.from(this.formatter.parse(promotion?.availability_end)) : null

                            this.prepareEcommerce = this.parameterService.getValueByOther(promotion.ecommerce, 'ecommerce').at(0)
                            this.prepareType = this.parameterService.getValueByOther(promotion.type.toString(), 'type_promotion').at(0)
                            this.prepareDivision = this.parameterService.getValueByOther(promotion.type_division, 'division');

                            this.store.select(PromotionState.selectedPromotionItems).pipe(
                                delay(100),
                                takeUntil(this.destroy$)).subscribe({
                                    next: (response) => {

                                        response?.forEach((item, index) => {
                                            if (index === 0) {
                                                this.clearProducts()
                                                this.form.controls.amount.setValue(item.amount || 0)
                                                if (Number(promotion.condition_promotion) === 2) {
                                                    this.form.controls.quantity.setValue(item.quantity || 0)
                                                }
                                            }
                                            this.onOnlyAddProduct(item)
                                        })
                                        this.onOnlySetProductInTable(promotion.type.toString())
                                    }
                                })

                            FormService.enableDisableSpecificFields(this.form, ['type', 'condition_promotion', 'amount', 'quantity'], false)
                        })
                    })

            }
        })

    }

    private initForm() {
        this.form = this.formBuilder.group<PromotionForm>({
            code: new FormControl(null),
            ecommerce: new FormControl(null, [Validators.required]),
            reference: new FormControl(null),
            type: new FormControl(null, [Validators.required]),
            type_division: new FormControl(null),
            availability_start: new FormControl(null, [Validators.required]),
            availability_end: new FormControl(null, [Validators.required]),
            condition_promotion: new FormControl(null),
            new_customer: new FormControl(null),
            status: new FormControl(null),
            amount: new FormControl(null),
            quantity: new FormControl(null),
            products: this.formBuilder.array([] as OptionalAll<PrepareOption>[]),
        })
    }

    getType() {
        const type = Number(this.form.getRawValue().type) //Number(this.form.value.type)
        const types = this.store.selectSnapshot(ParameterState.parametersSelect2('type_promotion'))
        const type_extra = types.find((item) => item.value === type)?.other.value
        return type_extra
    }

    onOnlyAddProduct(data: Partial<PrepareOption>) {
        (this.form.get('products') as FormArray).push(this.initItemsProduct(data));
    }

    onOnlySetProductInTable(typeCheck: string = null) {
        const type = typeCheck ?? this.getType()

        if (type === 'precio-final') this.tableConfigFinalPrice.data = (this.form.get('products') as FormArray).value
        if (type === 'escala') this.tableConfigScale.data = (this.form.get('products') as FormArray).value
        if (type === 'lleva-gratis' && this.form.getRawValue().condition_promotion === 1) this.tableConfigBonusGiftAmount.data = (this.form.get('products') as FormArray).value
        if (type === 'lleva-gratis' && this.form.getRawValue().condition_promotion === 2) this.tableConfigBonusGiftQuantity.data = (this.form.get('products') as FormArray).value
    }

    onAddProduct(data: Partial<PrepareOption>, typeCheck: string = null) {
        console.log(data);
        (this.form.get('products') as FormArray).push(this.initItemsProduct({
            ...data,
            fk_product: data.code,
            code: 0
        }));

        const type = typeCheck ?? this.getType()
        if (type === 'precio-final') this.tableConfigFinalPrice.data = (this.form.get('products') as FormArray).value
        if (type === 'escala') this.tableConfigScale.data = (this.form.get('products') as FormArray).value
        if (type === 'lleva-gratis' && this.form.getRawValue().condition_promotion === 1) this.tableConfigBonusGiftAmount.data = (this.form.get('products') as FormArray).value
        if (type === 'lleva-gratis' && this.form.getRawValue().condition_promotion === 2) this.tableConfigBonusGiftQuantity.data = (this.form.get('products') as FormArray).value
    }

    private initItemsProduct(product?: Partial<PrepareOption>) {
        const totalItems = (this.form.get('products') as FormArray).length
        //  En "lleva gratis por cantidad" la fila no configura nada propio: `quantity` lleva el umbral
        //  de piezas del carrito (el mismo para todas las filas, igual que `amount` en "por monto"),
        //  la cant. mínima es siempre 1 y el descuento siempre 100 porque el regalo es gratis.
        const esLlevaGratisPorCantidad = this.getType() === 'lleva-gratis'
            && Number(this.form.getRawValue().condition_promotion) === 2

        return this.formBuilder.group<PromotionProductForm>({
            item: new FormControl(totalItems + 1),
            code: new FormControl(product?.code || 0),
            fk_product: new FormControl(product?.fk_product || 0),
            quantity: new FormControl(Number(product?.quantity || this.form.get('quantity').getRawValue() || 0)),
            discount: new FormControl(esLlevaGratisPorCantidad ? 100 : (product?.discount || 0)),
            name: new FormControl(product?.name),
            reference: new FormControl(product?.reference),
            quantity_min: new FormControl(esLlevaGratisPorCantidad ? 1 : (product?.quantity_min || 0)),
            quantity_max: new FormControl(product?.quantity_max || 0),
            amount: new FormControl(Number(this.form.get('amount').getRawValue() || 0)),
            //amount: new FormControl(product?.amount || 0),
        })
    }

    private removeLineByItem(item: number) {
        const products = this.form.get('products') as FormArray
        const index = products.controls.findIndex((control) => control.get('item').value === item)
        products.removeAt(index)
        this.onOnlySetProductInTable()
    }

    onRowClick(_event: any) {
        const event = _event as IActionModal<PrepareOption>
        if (event.actionToPerform === 'delete' && event?.data?.item > 0) {
            this.removeLineByItem(event.data.item)
        }
    }

    onSave() {
        this.form.markAllAsTouched();

        if (!this.form.valid) {
            this.notificationService.showError('Complete los campos requeridos', 'Aviso')
            return;
        }

        const ecommerce = Number(this.form.value.ecommerce)
        const ecommerceList = this.store.selectSnapshot(ParameterState.parametersSelect2('ecommerce'))
        const ecommerce_extra = ecommerceList.find((item) => item.value === ecommerce)?.other.value


        const division = this.form.value.type_division?.map((item) => Number(item))
        const divisionList = this.store.selectSnapshot(ParameterState.parametersSelect2('division'))
        const division_extra = division?.map((item) => divisionList.find((item2) => item2.value === item)?.other.value)

        const data = {
            ...this.form.getRawValue(),
            code: this.id || 0,
            ecommerce: ecommerce_extra,
            type: this.getType(),
            type_division: Array.isArray(division_extra) && division_extra.length > 0 ? division_extra : null,
            condition_promotion: Number(this.form.getRawValue().condition_promotion),
            // El input es de texto: sin esto el API recibe "500" y rechaza el double con 400
            amount: Number(this.form.getRawValue().amount) || 0,
            quantity: Number(this.form.getRawValue().quantity) || 0,
            new_customer: this.form.value.new_customer === true || this.form.value.new_customer === 1 ? 'yes' : 'no',
            status: this.form.value.status === true || this.form.value.status === 1 ? 'active' : 'inactive',
        }
        let action = new CreatePromotion(data);
        if (this.type === 'edit') {
            action = new UpdatePromotion(data)
        }

        this.store.dispatch(action)

    }

    onRowAction(event: any) {
        console.log("el evento entro", event)

        if (event.actionToPerform === 'delete') {
            this.deleteRow(event.data);
        }
        if (event.actionToPerform === 'edit') {
            this.editProducto(event.data);

        }
    }

    deleteRow(row: any) {
       if(row.code != 0) {
           this.promosionService.deleteProducto(row.code).subscribe({
               next: (result) => {
                    console.log(result)   
                    if (result) {
                        this.ngOnInit()
                   }
               },
               error: (err) => {
                   console.error('Error al eliminar el producto:', err);
               }
           });
       }else {
        this.removeLineByItem(row.item)
       }
    }

    editProducto (row: any) {
        this.onShowModalEdit(row.code);
    }

    onProductUpdated() {
        this.ngOnInit()
    }


}
