import {Component, Input, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {Observable, Subject, forkJoin, mergeMap, of, switchMap, takeUntil, distinctUntilChanged, debounceTime, filter} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbNav} from '@ng-bootstrap/ng-bootstrap';

import {CreateCoupon, EditCoupon, UpdateCoupon} from '@shared/action/coupons.action';
import {GetParameters, GetProductsToSelect} from '@shared/action';
import {Select2Data, Select2SearchEvent, Select2UpdateValue} from 'ng-select2-component';

import {ActivatedRoute, Router} from '@angular/router';
import {CouponForm} from '@shared/interface/coupon.interface';
import {CouponState} from '@shared/state/coupon.state';
import {FormService} from '@shared/validator/form.service';
import {FormValidator} from '@shared/validator/form-validator';
import {NotificationService} from '@shared/services/index.service';
import {ParameterService} from '@shared/services/parameter.service';
import {ParameterState} from '@shared/state/parameter.state';
import {ProductState} from '@shared/state/product.state';
import {Select2DataFormat} from '@shared/interface';
import {TypeForm} from 'src/app/shared/types/util.types';
import {RandomGeneratorService} from '@shared/services/random-generator.service';

@Component({
    selector: 'app-form-coupons',
    templateUrl: './form-coupons.component.html',
    styleUrl: './form-coupons.component.scss'
})
export class FormCouponsComponent implements OnInit, OnDestroy {
    @Input() type: TypeForm
    @ViewChild('nav') nav: NgbNav;
    @Select(ParameterState.parametersSelect2('ecommerce')) ecommerce$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('coupon_customer')) couponCustomer$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('division')) division$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('coupon_apply_discount')) couponApplyDiscount$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('coupon_apply_discount_to')) couponApplyDiscountTo$: Observable<Select2DataFormat<string>[]>;

    @Select(ParameterState.parametersSelect2('tax', false)) tax$: Observable<Select2DataFormat<string>[]>;
    @Select(ParameterState.parametersSelect2('shipping', false)) shipping$: Observable<Select2DataFormat<string>[]>;


    public active = 'tab_general';
    public tabError: string | null;

    public form: FormGroup<CouponForm>
    private destroy$ = new Subject<void>();
    public id: number;

    prepareEcommerce: number[] = []
    prepareCouponCustomer: number
    prepareDivision: number[] = []
    prepareCouponApplyDiscount: number
    prepareCouponApplyDiscountTo: number
    prpeareCouponTax: number
    prpeareCouponShipping: number

    products: Select2Data = []
    productsFiltered: Select2Data = []
    private lastEcommerceValue: string | null = null;

    //Calendar
    calendar = inject(NgbCalendar);
    displayMonths = 2;
    formatter = inject(NgbDateParserFormatter);
    fromDate: NgbDate | null;
    hoveredDate: NgbDate | null = null;

    toDate: NgbDate | null
    today = inject(NgbCalendar).getToday();

    navigation: 'select' | 'arrows' | 'none' = 'select'
    outsideDays: 'visible' | 'hidden' | 'collapsed' = 'visible';
    showWeekNumbers = true;
    model: NgbDateStruct;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private parameterService: ParameterService,
        private notificationService: NotificationService,
        private randomGenerator: RandomGeneratorService
    ) {
    }

    ngOnInit(): void {
        this.initForm()
        this.initServices()

        this.form.controls.apply_discount.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                FormService.setRequiredSpecificFields(this.form, ['discount', 'amount', 'amount_tax_included', 'order_or_product', 'fk_product'], false)
                if (value === 1) {
                    this.form.controls.discount.setValidators([Validators.required, FormValidator.DiscountValidator])
                }
                if (value === 2) {
                    this.form.controls.amount.setValidators([Validators.required, FormValidator.AmountValidator])
                }
                FormService.updateValueAndValidityForFields(this.form, ['discount', 'amount', 'amount_tax_included', 'order_or_product', 'fk_product'])
            }
        })

        this.form.controls.order_or_product.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                FormService.setRequiredSpecificFields(this.form, ['fk_product'], false)
                if (value === 2) {
                    this.form.controls.fk_product.setValidators([Validators.required])
                }
                FormService.updateValueAndValidityForFields(this.form, ['fk_product'])
            }
        })

        // Listener para cargar productos cuando se selecciona un ecommerce
        this.form.controls.ecommerce.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged((prev, curr) => {
                // Comparar arrays para evitar llamadas duplicadas
                if (!prev && !curr) return true;
                if (!prev || !curr) return false;
                if (prev.length !== curr.length) return false;
                return prev.every((val, index) => val === curr[index]);
            }),
            filter((value: string[]) => {
                // Solo procesar si hay un valor válido
                return value && Array.isArray(value) && value.length > 0;
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (value: string[]) => {
                const ecommerceNumbers = value.map((item) => Number(item));
                const ecommerceOther = this.parameterService.getOtherByValue(ecommerceNumbers, 'ecommerce');
                if (ecommerceOther && ecommerceOther.length > 0) {
                    const ecommerceValue = ecommerceOther[0];
                    // Solo cargar si el valor es diferente al último procesado
                    if (this.lastEcommerceValue !== ecommerceValue) {
                        this.lastEcommerceValue = ecommerceValue;
                        this.loadProductsForEcommerce(ecommerceValue);
                    }
                }
            }
        })

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initServices() {
        const ecommerce$ = this.store.dispatch(new GetParameters({key: 'ecommerce'}));
        const couponCustomer$ = this.store.dispatch(new GetParameters({key: 'coupon_customer'}));
        const division$ = this.store.dispatch(new GetParameters({key: 'division'}));
        const couponApplyDiscount$ = this.store.dispatch(new GetParameters({
            key: 'coupon_apply_discount',
            addDefaultOption: true
        }));
        const couponApplyDiscountTo$ = this.store.dispatch(new GetParameters({
            key: 'coupon_apply_discount_to',
            addDefaultOption: true
        }));

        const tax$ = this.store.dispatch(new GetParameters({key: 'tax'}));
        const shipping$ = this.store.dispatch(new GetParameters({key: 'shipping'}));

        forkJoin([ecommerce$, couponCustomer$, division$, couponApplyDiscount$, couponApplyDiscountTo$, tax$, shipping$]).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {


                this.route.params
                    .pipe(
                        switchMap(
                            params => {
                                if (!params['id']) return of()
                                return this.store.dispatch(new EditCoupon(params['id'])).pipe(
                                    mergeMap(() => this.store.select(CouponState.selectedCoupon)))
                            })
                    ).pipe(takeUntil(this.destroy$)).subscribe({
                    next: coupon => {
                        this.id = coupon.code;
                        this.form.patchValue({
                            ...coupon,
                            status: !!(coupon?.status === 'active' || coupon?.status === 1),
                            free_shipping: !!(coupon?.free_shipping === 'yes' || coupon?.free_shipping === 1),
                            amount_tax_included: !!(coupon?.amount_tax_included === 'yes' || coupon?.amount_tax_included === 1),
                        }, { emitEvent: false })
                        this.fromDate = coupon?.availability_start ? NgbDate.from(this.formatter.parse(coupon?.availability_start)) : null
                        this.toDate = coupon?.availability_end ? NgbDate.from(this.formatter.parse(coupon?.availability_end)) : null
                        this.prepareCouponCustomer = this.parameterService.getValueByOther(coupon.customer_type, 'coupon_customer').at(0)
                        this.prepareDivision = this.parameterService.getValueByOther(coupon.division, 'division')
                        this.prepareEcommerce = this.parameterService.getValueByOther(coupon.ecommerce, 'ecommerce')
                        this.prepareCouponApplyDiscount = this.parameterService.getValueByOther(coupon.apply_discount.toString(), 'coupon_apply_discount').at(0)
                        this.prepareCouponApplyDiscountTo = this.parameterService.getValueByOther(coupon.order_or_product.toString(), 'coupon_apply_discount_to').at(0)

                        this.prpeareCouponTax = this.parameterService.getValueByOther(coupon.tax_included.toString(), 'tax').at(0)
                        this.prpeareCouponShipping = this.parameterService.getValueByOther(coupon.shipping_included.toString(), 'shipping').at(0)

                        // Cargar productos cuando se edita un cupón con ecommerce
                        if (this.prepareEcommerce && this.prepareEcommerce.length > 0) {
                            const ecommerceOther = this.parameterService.getOtherByValue(this.prepareEcommerce, 'ecommerce');
                            if (ecommerceOther && ecommerceOther.length > 0) {
                                const ecommerceValue = ecommerceOther[0];
                                // Actualizar el último valor procesado para evitar llamadas duplicadas
                                this.lastEcommerceValue = ecommerceValue;
                                this.loadProductsForEcommerce(ecommerceValue);
                            }
                        }

                    }
                })

            }
        })
    }

    private loadProductsForEcommerce(ecommerceValue: string) {
        if (!ecommerceValue) return;
        
        this.store.dispatch(new GetProductsToSelect(ecommerceValue))
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                complete: () => {
                    this.products = this.store.selectSnapshot(ProductState.selectProductToSelect);
                    this.productsFiltered = this.products;
                }
            });
    }

    onSearchProduct(event: Select2SearchEvent<Select2UpdateValue>) {
        const termin = event.search
        if (termin.length < 3) {
            this.productsFiltered = this.products
        } else {
            this.productsFiltered = this.products.filter(product => product.label.toLowerCase().includes(termin.toLowerCase()))
        }
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

    onGenerateCode() {
        this.form.get('reference').setValue(this.randomGenerator.generateRandomString({
            format: '00000-LLLL-000-LL-0',
            transform: 'uppercase'
        }))
    }

    private initForm() {
        this.form = this.formBuilder.group<CouponForm>({
            code: new FormControl(null),
            ecommerce: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
            reference: new FormControl(null, [Validators.required]),
            status: new FormControl(null),

            customer_type: new FormControl(null),
            division: new FormControl(null),
            availability_start: new FormControl(null, [Validators.required]),
            availability_end: new FormControl(null, [Validators.required]),
            quantity_available: new FormControl(null, [Validators.required, FormValidator.MinQuantityValidator]),
            minimum_amount: new FormControl(null),
            available_per_user: new FormControl(null, [FormValidator.MinQuantityValidator]),
            tax_included: new FormControl(null),
            shipping_included: new FormControl(null),


            free_shipping: new FormControl(null),
            apply_discount: new FormControl(null),
            discount: new FormControl(null, [FormValidator.DiscountValidator]),

            amount: new FormControl(null),
            amount_tax_included: new FormControl(null),

            order_or_product: new FormControl(null),
            fk_product: new FormControl(null)
        })
    }

    onSave() {

        if (this.form.invalid) {
            this.notificationService.showError('Complete los campos requeridos', 'Aviso')
            FormService.markFormGroupTouched(this.form);
            return
        }

        const ecommerce = this.form.value.ecommerce.map((item) => Number(item))
        const ecommerceList = this.store.selectSnapshot(ParameterState.parametersSelect2('ecommerce'))
        const ecommerce_extra = ecommerce.map((item) => ecommerceList.find((item2) => item2.value === item)?.other.value)

        const division = this.form.value.division?.map((item) => Number(item))
        const divisionList = this.store.selectSnapshot(ParameterState.parametersSelect2('division'))
        const division_extra = division?.map((item) => divisionList.find((item2) => item2.value === item)?.other.value)


        const customer_type = Number(this.form.controls.customer_type.value)
        const customerTypeList = this.store.selectSnapshot(ParameterState.parametersSelect2('coupon_customer'))
        const customer_type_extra = customerTypeList.find((item) => item.value === customer_type)?.other.value

        const apply_discount = Number(this.form.controls.apply_discount.value)
        const applyDiscountList = this.store.selectSnapshot(ParameterState.parametersSelect2('coupon_apply_discount'))
        const apply_discount_extra = applyDiscountList.find((item) => item.value === apply_discount)?.other.value

        const order_or_product = Number(this.form.controls.order_or_product.value)
        const applyDiscountToList = this.store.selectSnapshot(ParameterState.parametersSelect2('coupon_apply_discount_to'))
        const apply_discount_to_extra = applyDiscountToList.find((item) => item.value === order_or_product)?.other.value

        const data = {
            ...this.form.getRawValue(),
            code : !this.id ? 0 : this.id,
            ecommerce: ecommerce_extra,
            division: division_extra && Array.isArray(division_extra) && division_extra.length > 0 ? division_extra : null,
            status: this.form.controls.status.value === true || this.form.controls.status.value === 1 ? 'active' : 'inactive',
            free_shipping: this.form.controls.free_shipping.value === true || this.form.controls.free_shipping.value === 1 ? 'yes' : 'no',
            tax_included: this.form.controls.tax_included.value === true || this.form.controls.tax_included.value === 1 ? 'yes' : 'no',
            shipping_included: this.form.controls.shipping_included.value === true || this.form.controls.shipping_included.value === 1 ? 'yes' : 'no',
            amount: this.form.controls.amount.value ? Number(this.form.controls.amount.value) : null,
            apply_discount: apply_discount_extra || null,
            order_or_product: apply_discount_to_extra || null,
            amount_tax_included: !apply_discount_extra ? null : (this.form.controls.amount_tax_included.value === true || this.form.controls.amount_tax_included.value === 1 ? 'yes' : 'no'),
            customer_type: customer_type_extra || null,
            fk_product:  apply_discount_to_extra && apply_discount_to_extra === 'product' && this.form.controls.fk_product.value ? Number(this.form.controls.fk_product.value) : null,

        }

        let action = new CreateCoupon(data)
        if (this.type === 'edit') {
            action = new UpdateCoupon(data, this.id)
        }

        this.store.dispatch(action).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                const selected = this.store.selectSnapshot(CouponState.selectedCoupon)
                if (selected.code > 0) {
                    this.router.navigate(['/coupons'])
                }
            }
        })


    }


}
