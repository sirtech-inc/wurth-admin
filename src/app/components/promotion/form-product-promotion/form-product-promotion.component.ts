import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CustomeFormControl, OptionalAll } from '@shared/types/util.types';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select2Data, Select2Option, Select2SearchEvent, Select2UpdateValue } from 'ng-select2-component';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { FormService } from '@shared/validator/form.service';
import { GetProductsToSelect } from '@shared/action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrepareItemPostResponse, PrepareOption } from '@shared/interface/promotion.interface';
import { ProductState } from '@shared/state/product.state';
import { Store } from '@ngxs/store';
import { FormValidator } from "@shared/validator/form-validator";
import { PromotionService } from '@shared/services/promotion.service';
import { NotificationService } from '@shared/services/notification.service';
import { ParameterState } from '@shared/state/parameter.state';

type PrepareForm = CustomeFormControl<OptionalAll<PrepareOption>>

@Component({
    selector: 'app-form-product-promotion',
    templateUrl: './form-product-promotion.component.html',
    styles: ``
})
export class FormProductPromotionComponent implements OnInit, OnDestroy {
    public modalOpen: boolean = false;
    @ViewChild("productModal", { static: false }) ProductModal: TemplateRef<string>;
    @Output('opened') opened = new EventEmitter<boolean>();
    products: Select2Data = []
    productsFiltered: Select2Data = []
    private destroy$ = new Subject<void>();
    public form: FormGroup<PrepareForm>
    _id: number
    @Input('type') type: number | string
    @Input('condition') condition: number | string
    @Input('amount') amount: number
    @Input() items: any[] = [];
    @Input() ecommerceCtrl!: FormControl;

    @Output() updated = new EventEmitter<any>();
    @Output('add') add = new EventEmitter<Partial<PrepareOption>>()

    constructor(
        private modalService: NgbModal,
        private store: Store,
        private formBuilder: FormBuilder,
        private promociones: PromotionService,
        private notificationService: NotificationService,
    ) {
    }


    ngOnInit() {
        this.prepareForm()
        const ecommerce = this.ecommerceCtrl.value || '';
        const ecommerceList = this.store.selectSnapshot(ParameterState.parametersSelect2('ecommerce'))
        const ecommerce_extra = ecommerceList.find((item) => item.value === ecommerce)?.other.value

        forkJoin([
            this.store.dispatch(new GetProductsToSelect(ecommerce_extra))
        ]).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.products = this.store.selectSnapshot(ProductState.selectProductToSelect)
                this.productsFiltered = this.products
            }
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private prepareForm() {
        this.form = this.formBuilder.group<PrepareForm>({
            item: new FormControl(null),
            code: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required]),
            reference: new FormControl(null, [Validators.required]),
            quantity_min: new FormControl(null, [Validators.required]),
            quantity_max: new FormControl(null, [Validators.required]),
            discount: new FormControl(null, [Validators.required, FormValidator.DiscountValidator]),
            quantity: new FormControl(null),
        })

        if (this.type === 'precio-final') {
            FormService.setRequiredSpecificFields(this.form, ['quantity_max'], false)
            FormService.updateValueAndValidityForFields(this.form, ['quantity_max'])
        }
        if (this.type === 'lleva-gratis' && this.condition === 1) { // por monto
            FormService.setRequiredSpecificFields(this.form, ['quantity_max', 'quantity_min', 'discount'], false)
            FormService.updateValueAndValidityForFields(this.form, ['quantity_max', 'quantity_min', 'discount'])
        }
        if (this.type === 'lleva-gratis' && this.condition === 2) { // por cantidad
            // La cantidad ya no se pide acá: la define el campo "Cantidad" del formulario de la promoción
            FormService.setRequiredSpecificFields(this.form, ['quantity_min', 'quantity_max', 'quantity'], false)
            FormService.updateValueAndValidityForFields(this.form, ['quantity_min', 'quantity_max', 'quantity'])
        }
    }


    onSearchProduct(event: Select2SearchEvent<Select2UpdateValue>) {
        const removeAccents = (value: string) =>
            value
                .normalize('NFD')                // separa acentos
                .replace(/[\u0300-\u036f]/g, '') // elimina acentos
                .toLowerCase();

        const search = removeAccents(event.search.trim());

        if (search.length < 3) {
            this.productsFiltered = this.products;
            return;
        }

        this.productsFiltered = this.products.filter(product => {
            const opt = product as any;

            const label = removeAccents(opt.label ?? '');
            const reference = removeAccents(opt.other.reference ?? '');

            return label.includes(search) || reference.includes(search);
        });

    }

    onSelectProduct(event) {
        if (event) {
            this.form.controls.code.setValue(event.value)
            this.form.controls.name.setValue(event.options[0].label)
            this.form.controls.reference.setValue(event.options[0].other.reference)
        }
    }

    async openModal() {
        this.modalOpen = true;
        this.modalService.open(this.ProductModal, {
            ariaLabelledBy: 'product-Modal',
            windowClass: 'theme-modal modal-fade',
            backdrop: 'static',
        }).result.then((result) => {
        }, (reason) => {
            this.modalOpen = false;
            this.opened.emit(false);
        });
    }

    onAdd() {
        if (this._id == 0) {
            if (this.form.valid) {

                const reference = this.form.value.reference;

                const foundItem = this.items.find(item => item.reference === reference);

                if (foundItem) {
                    this.notificationService.showWarn('El producto ' + foundItem.name + ' ya fue agregado.');
                    return;
                }

                const prepareFormat = {
                    ...this.form.value,
                    code: this.form.value.code ? Number(this.form.value.code) : 0,
                    quantity: this.form.value.quantity ? Number(this.form.value.quantity) : 0,
                    quantity_min: this.form.value.quantity_min ? Number(this.form.value.quantity_min) : 0,
                    quantity_max: this.form.value.quantity_max ? Number(this.form.value.quantity_max) : 0,
                    discount: this.form.value.discount ? Number(this.form.value.discount) : 0,
                    //amount : this.amount ?? 0
                }
                this.add.emit(prepareFormat)
                this.modalService.dismissAll()
            }
        } else {
            console.log("edito")
            const form: PrepareItemPostResponse = {
                code: this._id,
                name: this.form.value.name,
                reference: this.form.value.reference,
                minimum_quantity: this.form.value.quantity_min,
                discount: this.form.value.discount,
                quantity: this.form.value.quantity,
                amount: 0,
                fk_product: this.form.value.fk_product,
                fk_code: this._id,
                fk_promotion: this.form.value.fk_product,
                maximum_quantity: this.form.value.quantity_max,

            };
            this.promociones.updateProductoPromocionFinal(this._id, form).subscribe({
                next: (result) => {
                    this.modalService.dismissAll()
                    this.updated.emit();
                }
            })
        }

    }


    onCloseModal() {
        this.destroy$.next();
        this.destroy$.complete();
        this.opened.emit(false)
        this.modalService.dismissAll()
    }

    /** función pública para asignar id desde el padre */
    setId(id?: number) {
        this._id = id;
        this.promociones.getProductoPromocionFinal(this._id).subscribe({
            next: (result) => {
                this.form.patchValue({
                    code: result.code,
                    name: result.name,
                    reference: result.reference,
                    quantity_min: result.minimum_quantity,
                    quantity_max: result.minimum_quantity,
                    discount: result.discount,
                    quantity: result.minimum_quantity,
                    amount: 0,
                    fk_product: result.fk_product,

                });

            },
            error: (err) => {
                console.error('Error al eliminar el producto:', err);
            }
        });
    }
}
