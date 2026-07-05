import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Attachment, Images} from "@shared/interface";
import {FormService} from "@shared/validator/form.service";
import {NotificationService} from "@shared/services/notification.service";
import {Select, Store} from "@ngxs/store";
import {UploadFileImage} from "@shared/action/file-image.action";
import {FormValidator} from "@shared/validator/form-validator";
import {CustomeFormControl, OptionalAll} from "@shared/types/util.types";
import {forkJoin, map, mergeMap, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {
    CarrierDepartment,
    CarrierRange,
    CarrierRangeDepartmentCost,
    CarrierValuesPost,
    GroupCarrierForm,
    CarrierDepartments as ListCarrierDepartments, Carrier
} from "@shared/interface/carrier.interface";
import {CarrierDepartments, CreateUpdateCarrier, EditCarrier} from "@shared/action/carrier.action";
import {CarrierState} from "@shared/state/carrier.state";
import {ActivatedRoute} from "@angular/router";
import {ConvertClassHelper} from "@shared/helper/convert-class.helper";
import {CheckClassHelper} from "@shared/helper/check-class-helper";

@Component({
    selector: 'app-form-carrier',
    templateUrl: './form-carrier.component.html',
    styleUrl: './form-carrier.component.scss'
})
export class FormCarrierComponent implements OnInit, OnDestroy {

    @Select(CarrierState.selectedCarrierLoader) carrierLoader$: Observable<boolean>
    @Select(CarrierState.selectedDepartments) departments$: Observable<CarrierDepartments[]>

    public readonly MAX_RANGE_COLS = 4

    @Input() type: string;
    @ViewChild('nav') nav: NgbNav;

    private destroy$ = new Subject<void>();
    public active = 'general_settings';
    public tabError: string | null;
    public form: FormGroup
    private fileImage: File = null;
    private id: number
    private fileImageSelected: Attachment

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private store: Store,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.initForm()
        this.initService()
    }

    ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
    }

    initService() {

        forkJoin(
            [this.store.dispatch(new CarrierDepartments())]
        ).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {

                this.route.params.pipe(
                    switchMap(params => {
                        if (!params['id']) {
                            this.prepareDefaultRangeDepartment()
                            return of()
                        }
                        return this.store.dispatch(new EditCarrier(params['id']))
                            .pipe(mergeMap(() => this.store.select(CarrierState.selectedCarrier)))
                    }), takeUntil(this.destroy$)
                ).subscribe(carrier => {

                    this.fileImageSelected = carrier.carrier.images
                    this.form.get('carrier').patchValue({
                        ...carrier.carrier,
                        status: !!(carrier.carrier.status === 'active' || carrier.carrier.status === 1)
                    })
                    this.form.get('location').patchValue({
                        ...carrier.location,
                        free_shipping: !!(carrier.location.free_shipping === 'yes' || carrier.location.free_shipping === 1),
                        tax_included: !!(carrier.location.tax_included === 'yes' || carrier.location.tax_included === 1),
                    })
                    carrier.range.forEach((range) => {
                        this.addRange(range, false)
                    })
                    const prepareFormatDepartment = carrier.department.map((department) => {
                        return {
                            ...department,
                            costs: carrier.department_cost.filter((cost) => cost.fk_carrier_department === department.code)
                        }
                    })
                    prepareFormatDepartment.forEach((department) => {
                        this.addDepartment(department, department.costs)
                    })

                })

            }
        })
    }

    initForm() {
        this.form = this.formBuilder.group<GroupCarrierForm>({
            carrier: this.formBuilder.group<CustomeFormControl<OptionalAll<Carrier>>>({
                code: new FormControl(null, [FormValidator.PositiveIntegerValidator]),
                name: new FormControl(null, [Validators.required]),
                description: new FormControl(null),
                image: new FormControl(null, [FormValidator.PositiveIntegerValidator]),
                status: new FormControl(null),
                carrier_range: new FormControl(null),
            }),
            location: this.formBuilder.group({
                code: new FormControl(null),
                fk_carrier: new FormControl(null),
                free_shipping: new FormControl(null),
                tax_included: new FormControl(null),
            }),
            range: this.formBuilder.array([] as FormArray[]),
            department: this.formBuilder.array([] as FormArray[]),
        })
    }

    getErrors(groupName: string, fieldName: string): any {
        const group: AbstractControl | null = this.form.get(groupName);
        if (group instanceof FormGroup) {
            const control: AbstractControl | null = group.get(fieldName);
            if (control && control.touched && control.errors) {
                return control.errors
            }
            return null
        }
        return null;
    }

    prepareDefaultRangeDepartment() {
        this.addRange({
            code: 0,
            fk_carrier: 0,
            range_min: null,
            range_max: null,
        })
        const departments = this.store.selectSnapshot(CarrierState.selectedDepartments) as ListCarrierDepartments[]
        if (departments) {

            departments.forEach((department) => {
                const _department: CarrierDepartment = {
                    code: null,
                    fk_carrier: null,
                    fk_department: department.code,
                    department: department.name,
                    active: null,
                }
                this.addDepartment(_department, [])
            })

        }
    }

    private addRange(data: OptionalAll<CarrierRange>, required?: boolean) {
        (this.form.get('range') as FormArray).push(this.initRange(data, required))
    }

    private initRange(data: OptionalAll<CarrierRange>, required: boolean) {
        return this.formBuilder.group({
            code: new FormControl(data.code),
            fk_carrier: new FormControl(data.fk_carrier, [required ? Validators.required : Validators.nullValidator]),
            range_min: new FormControl(data.range_min, [required ? Validators.required : Validators.nullValidator]),
            range_max: new FormControl(data.range_max, [required ? Validators.required : Validators.nullValidator]),
        })
    }

    private addDepartment(department: CarrierDepartment, cost: any[]) {
        (this.form.get('department') as FormArray).push(this.initDepartment(department, cost))
    }

    private initDepartment(department: CarrierDepartment, costs: CarrierRangeDepartmentCost[]) {
        let _cost: FormGroup[]
        if (Array.isArray(costs) && costs.length === 0) {
            _cost = [
                this.formBuilder.group({
                    code: new FormControl(null),
                    fk_carrier_range: new FormControl(null),
                    fk_carrier_department: new FormControl(null),
                    shipping_cost: new FormControl(null)
                })
            ]
        } else {
            _cost = costs.map((item) => {
                return this.formBuilder.group({
                    code: new FormControl(item?.code || 0),
                    fk_carrier_range: new FormControl(item?.fk_carrier_range || 0),
                    fk_carrier_department: new FormControl(item?.fk_carrier_department || 0),
                    shipping_cost: new FormControl(item?.shipping_cost || null)
                })
            })
        }

        const _department = this.formBuilder.group({
            code: new FormControl(department?.code || 0),
            fk_carrier: new FormControl(department?.fk_carrier || 0),
            fk_department: new FormControl(department?.fk_department || 0),
            active: new FormControl(department ? (department?.active === 'active' || department?.active === 1) : null),
            department_name: new FormControl(department?.department || null),
            costs: this.formBuilder.array([] as FormArray[])
        })

        _cost.forEach((item) => {
            (_department.get('costs') as FormArray).push(item)
        })

        return _department

    }

    get ranges(): FormArray {
        return this.form.get('range') as FormArray;
    }

    get departments(): FormArray {
        return this.form.get('department') as FormArray;
    }

    get isLastDepartment() {
        return (index: number) => {
            return index === this.departments.length - 1
        }
    }

    public onRemoveColumn(indexRange: number) {
        const ranges = this.ranges
        const departments = this.departments
        const codeRange = ranges.controls[indexRange].value.code
        if (codeRange > 0) {
            const carrierRange = this.form.get('carrier').get('carrier_range').value
            const _carrierRange = CheckClassHelper.isNull(carrierRange) ? [codeRange] : [...carrierRange, codeRange]
            this.form.get('carrier').get('carrier_range').setValue(_carrierRange)
        }
        ranges.removeAt(indexRange)
        departments.controls.forEach((department, index) => {
            const costs = this.costs(index)
            costs.removeAt(indexRange)
        })
    }

    public isRangeValid(): boolean {
        const ranges = this.ranges
        let isValid = true
        ranges.controls.forEach((range) => {
            const rangeMin = range.get('range_min').value
            const rangeMax = range.get('range_max').value
            if (rangeMin === null || rangeMax === null) {
                isValid = false
            }
        })
        return isValid
    }

    public onAddRange() {

        if (this.isRangeValid() === false && this.limitRangeCols === false) {
            this.notificationService.showError('Complete los campos requeridos de los rangos mínimo y máximo antes de agregar otro bloque', 'Aviso')
            return
        }

        const totalRanges = this.ranges.length
        if (totalRanges >= this.MAX_RANGE_COLS) return
        this.addRange({
            code: 0,
            fk_carrier: this.id || 0,
            range_min: null,
            range_max: null,
        }, true)

        const departments = this.departments
        departments.controls.forEach((department, index) => {
            const costs = this.costs(index)
            costs.push(this.formBuilder.group({
                code: new FormControl(null),
                fk_carrier_range: new FormControl(null),
                fk_carrier_department: new FormControl(null),
                shipping_cost: new FormControl(null)
            }))
        })
    }

    get limitRangeCols(): boolean {
        return this.ranges.length >= this.MAX_RANGE_COLS
    }

    costs(departmentIndex: number) {
        return this.departments.at(departmentIndex).get('costs') as FormArray;
    }

    public prepareImage() {
        if (!this.fileImageSelected) return null
        const file: Attachment = {
            ...this.fileImageSelected,
        }
        return file
    }

    onSelectFile(event: File | File[]) {
        this.fileImage = event as File
    }

    onFilesRegistered(event: Attachment[]) {
        if (event && event.length > 0) {
            this.form.get('carrier').get('image').setValue(event[0].code)
        } else {
            this.form.get('carrier').get('image').setValue(null)
        }

    }

    onSave() {

        if (!this.form.valid) {
            this.notificationService.showError('Complete los campos requeridos', 'Aviso')
            FormService.markFormGroupTouched(this.form)
            return;
        }
        ///this.form.get('carrier').get('carrier_range').value
        ///return


        this.store.dispatch(new UploadFileImage(this.fileImage, 'queryString', {
            vDescripcion: this.form.get('carrier').get('name').value,
            vModule: 'carrier',
        })).pipe(
            map((response) => response.file.selectedFile as Images)
        ).subscribe({
                next: (fileImage) => {

                    const data: OptionalAll<CarrierValuesPost> = {
                        carrier: {
                            code: this.form.controls['carrier'].value['code'] || 0,
                            name: this.form.controls['carrier'].value['name'],
                            description: this.form.controls['carrier'].value['description'],
                            image: fileImage?.code || this.form.controls['carrier'].value['image'],
                            status: this.form.controls['carrier'].get('status').value === 1 || this.form.controls['carrier'].get('status').value === true ? 'active' : 'inactive',
                            carrier_range: this.form.get('carrier').get('carrier_range').value //this.form.controls['carrier'].value['carrier_range'].value
                        },
                        location: {
                            code: this.form.controls['location'].value['code'] || 0,
                            fk_carrier: this.id || 0,
                            free_shipping: this.form.controls['location'].get('free_shipping').value === 1 || this.form.controls['location'].get('free_shipping').value === true ? 'yes' : 'no',
                            tax_included: this.form.controls['location'].get('tax_included').value === 1 || this.form.controls['location'].get('tax_included').value === true ? 'yes' : 'no',
                        },
                        range: this.form.controls['range'].value.map((range: CarrierRange, indexRange: number) => {
                            return {
                                range: {
                                    code: range['code'] || 0,
                                    fk_carrier: this.id || 0,
                                    range_min: ConvertClassHelper.toNumber(range['range_min']),
                                    range_max: ConvertClassHelper.toNumber(range['range_max']),
                                },
                                department: this.form.controls['department'].value.map((department: CarrierDepartment) => {
                                    return {
                                        department: {
                                            code: department['code'] || 0,
                                            fk_carrier: this.id || 0,
                                            fk_department: department['fk_department'],
                                            active: department.active === 1 || department.active === true ? 'active' : 'inactive'
                                        },
                                        cost: {
                                            code: department['costs'][indexRange].code || 0,
                                            shipping_cost: ConvertClassHelper.toNumber(department['costs'][indexRange].shipping_cost)
                                        }
                                    }
                                })
                            }
                        })
                    }


                    this.store.dispatch(new CreateUpdateCarrier(data))
                }
            }
        )

    }


}
