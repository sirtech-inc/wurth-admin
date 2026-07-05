import { DOCUMENT } from "@angular/common";
import { Component, Inject, Input, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDateParserFormatter, NgbNav } from "@ng-bootstrap/ng-bootstrap";
import { Select, Store } from "@ngxs/store";
import { GetParameters, GetRolesToSelect } from "@shared/action";
import { CustomerService } from "@shared/services/customer.service";
import { NotificationService } from "@shared/services/notification.service";
import { ParameterService } from "@shared/services/parameter.service";
import { CustomerState } from "@shared/state/customer.state";
import { ParameterState } from "@shared/state/parameter.state";
import { FormService } from "@shared/validator/form.service";
import { CustomValidators } from "@shared/validator/password-match";
import { Select2Data } from "ng-select2-component";
import { forkJoin, mergeMap, Observable, of, Subject, switchMap, takeUntil } from "rxjs";
import {
  CreateCustomer,
  EditCustomer,
  UpdateCustomer,
} from "src/app/shared/action/customer.action";
import { AddressDto, Customer, CustomerForm, Select2DataFormat, TableConfig } from "src/app/shared/interface";
import { StrictPartial, TypeForm } from "src/app/shared/types/util.types";

@Component({
  selector: "app-form-customer",
  templateUrl: "./form-customer.component.html",
})
export class FormCustomerComponent {
  @Input() type: TypeForm;
  @ViewChild("nav") nav: NgbNav;
  @Select(ParameterState.parametersSelect2("ecommerce")) ecommerce$: Observable<
    Select2DataFormat<string>[]
  >;
  public selectedEcommerce: string | null = null;

  public active = "general";
  public form: FormGroup<CustomerForm>;
  public id: number;
  public tabError: string | null;
  private destroy$ = new Subject<void>();

  public tableConfig: TableConfig = {
    columns: [
      { title: "Nro", dataField: "code" },
      { title: "alias", dataField: "name" },
      { title: "address", dataField: "address" },
    ],
    rowActions: [
      {
        label: "Eliminar",
        actionToPerform: "delete",
        icon: "ri-delete-bin-line",
        permission: "",
      },
    ],

    data: [] as AddressDto[],
    total: 0,

  };

  public courtesyType: Select2Data = [
    {
      value: "sr",
      label: "Sr",
    },
    {
      value: "sra",
      label: "Sra",
    },
    {
      value: "srta",
      label: "Srta",
    },
  ];

  public personType: Select2Data = [
    {
      value: "person",
      label: "Persona Natural",
    },
    {
      value: "company",
      label: "Empresa",
    },
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private direccionService: CustomerService,
    private formBuilder: FormBuilder,
    private parameterService: ParameterService,
    private notificationService: NotificationService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {

    this.getDirecciones()
    const ecommerce$ = this.store.dispatch(new GetParameters({ key: 'ecommerce' }));
    const roles$ = this.store.dispatch(new GetRolesToSelect());
    console.log(ecommerce$)
    forkJoin([ecommerce$, roles$]).pipe(takeUntil(this.destroy$)).subscribe({
      complete: () => {
        this.route.params
          .pipe(
            switchMap(params => {
              if (!params['id']) return of();
              return this.store
                .dispatch(new EditCustomer(params['id']))
                .pipe(mergeMap(() => this.store.select(CustomerState.selectedCustomer)))
            }), takeUntil(this.destroy$)
          ).subscribe({
            next: (customer) => {
              this.id = customer.code
              this.form.patchValue({
                ...customer,
                status: customer?.status === 'active' || customer?.status === true ? 1 : 0,
              })
              //this.selectedEcommerce = this.parameterService.getValueByOther(customer., 'ecommerce')

              FormService.enableDisableSpecificFields(this.form, ['email'], false);

              this.form.controls['password'].clearValidators();
              this.form.controls['password_confirmation'].clearValidators();
              this.form.controls['password'].updateValueAndValidity();
              this.form.controls['password_confirmation'].updateValueAndValidity();

            }
          })
      }
    })

  }

  initForm() {
    this.form = this.formBuilder.group<CustomerForm>({
      lastname: new FormControl(null, [Validators.required]),
      deal: new FormControl(null, [Validators.required]),
      document_number: new FormControl(null, [Validators.required]),
      ecommerce: new FormControl(null),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      company_name: new FormControl(null),
      customer_code: new FormControl(null),
      division: null,
      password_confirmation: new FormControl(null),
      people_using_product: new FormControl(null),
      name: new FormControl(null),
      phone: new FormControl(null),
      type: new FormControl(null),
      status: new FormControl(false), // si quieres usar el checkbox
    })
    this.form.get('password')?.valueChanges.subscribe(value => {
      this.form.get('password_confirmation')?.setValue(value, { emitEvent: false });
    });
  }
  onEcommerceChange(event: any) {
    console.log(event)


    this.selectedEcommerce = event?.options[0].label ?? null;
  }
  submit() {
    if (!this.form.valid) {
      this.notificationService.showError('Complete los campos requeridos', 'Aviso');
      FormService.markFormGroupTouched(this.form);
      return;
    }

    const data = {
      ...this.form.getRawValue(),
      status: this.form.value.status === 1 || this.form.value.status === true ? 'active' : 'inactive',
    };

    const ecommerce = this.selectedEcommerce;
    console.log(ecommerce)
    let action;

    if (this.type === 'edit' && this.id) {
      action = new UpdateCustomer({
        ...data,
        eccomerce: ecommerce// nota la propiedad llamada 'ecommerce'
      }, this.id);
    } else {
      action = new CreateCustomer({
        ...data,
        eccomerce: ecommerce
      });
    }

    this.store.dispatch(action).subscribe({
      complete: () => this.router.navigate(['/customers'])
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDirecciones() {
    const userCode = Number(this.route.snapshot.paramMap.get('id'));; // reemplaza con el código real del usuario
    this.direccionService.getUserAddresses(userCode).subscribe({
      next: (response) => {
        this.tableConfig.data = response.datos;
        this.tableConfig.total = response.datos.length; // opcional
      },
      error: (err) => {
        console.error("Error al cargar direcciones:", err);
      },
    });
  }

  getField(field: string) {
    return this.form.get(field).value; //controls[field].value
  }


}
