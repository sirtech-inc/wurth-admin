import {ActivatedRoute, Router} from '@angular/router';
import {AdvanceDropDownFormat, UserForm} from '@shared/interface';
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CreateUser, EditUser, UpdateUser} from '@shared/action';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, forkJoin, mergeMap, of, switchMap, takeUntil} from 'rxjs';
import {Select, Store} from '@ngxs/store';

import {CustomValidators} from '@shared/validator/password-match';
import {FormService} from '@shared/validator/form.service';
import {GetParameters} from '@shared/action/parameter.action';
import {GetRolesToSelect} from '@shared/action/role.action';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {ParameterService} from '@shared/services/parameter.service';
import {ParameterState} from '@shared/state/parameter.state';
import {RoleState} from '@shared/state/role.state';
import {Select2Data} from 'ng-select2-component';
import {TypeForm} from '@shared/types/util.types';
import {UserState} from '@shared/state/user.state';
import {NotificationService} from "@shared/services/notification.service";

@Component({
    selector: 'app-form-user',
    templateUrl: './form-user.component.html',
    styles: ``
})
export class FormUserComponent implements OnInit, OnDestroy {

    @Input() type: TypeForm;
    @ViewChild('nav') nav: NgbNav;

    @Select(ParameterState.parametersAdvanceDropDown('ecommerce')) ecommerce$: Observable<AdvanceDropDownFormat<any>[]>;
    @Select(RoleState.selectRoleToSelect) roles$: Observable<Select2Data>;


    public active = 'general';
    public form: FormGroup<UserForm>;
    public id: number;
    public tabError: string | null;
    public selectedEcommerce: number[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private parameterService: ParameterService,
        private notificationService: NotificationService,
    ) {
        this.initForm()
        if (this.type === 'edit' && this.id) {
            this.disablePasswordValidators();
        }
    }

disablePasswordValidators() {
  // quitar validadores
  this.form.get('password')?.clearValidators();
  this.form.get('password_confirmation')?.clearValidators();

  // opcional: resetear valores
  this.form.get('password')?.reset();
  this.form.get('password_confirmation')?.reset();

  // actualizar estado
  this.form.get('password')?.updateValueAndValidity();
  this.form.get('password_confirmation')?.updateValueAndValidity();
}
    ngOnInit(): void {
        const ecommerce$ = this.store.dispatch(new GetParameters({key: 'ecommerce'}));
        const roles$ = this.store.dispatch(new GetRolesToSelect());

        forkJoin([ecommerce$, roles$]).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.route.params
                    .pipe(
                        switchMap(params => {
                            if (!params['id']) return of();
                            return this.store
                                .dispatch(new EditUser(params['id']))
                                .pipe(mergeMap(() => this.store.select(UserState.selectedUser)))
                        }), takeUntil(this.destroy$)
                    ).subscribe({
                    next: (user) => {
                        this.id = user.code
                        this.form.patchValue({
                            ...user,
                            status: user?.status === 'active' || user?.status === true ? 1 : 0,
                        })
                        this.selectedEcommerce = this.parameterService.getValueByOther(user.ecommerce, 'ecommerce')
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

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm() {
        this.form = this.formBuilder.group<UserForm>({
            name: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            phone: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
            password: new FormControl('', [Validators.required, CustomValidators.PasswordValidatorLength(10), CustomValidators.PasswordValidatorUpperCase, CustomValidators.PasswordValidatorLowerCase, CustomValidators.PasswordValidatorNumeric, CustomValidators.PasswordValidatorSpecialCharacters]),
            password_confirmation: new FormControl('', [Validators.required, CustomValidators.PasswordValidatorLength(10), CustomValidators.PasswordValidatorUpperCase, CustomValidators.PasswordValidatorLowerCase, CustomValidators.PasswordValidatorNumeric, CustomValidators.PasswordValidatorSpecialCharacters]),
            fk_role: new FormControl(0, [Validators.required]),
            ecommerce: new FormControl(null, [Validators.required]),
            status: new FormControl(null),
        }, {
            validators: CustomValidators.MatchValidator('password', 'password_confirmation')
        })
    }


    get passwordMatchError() {
        return (
            this.form.getError('mismatch') &&
            this.form.get('password_confirmation')?.touched
        );
    }


    selectRoleItem(data: number[]) {
        const selected = this.parameterService.getOtherByValue(data, 'ecommerce') //.getOtherById(data)
        if (selected && Array.isArray(selected) && selected.length > 0) {
            this.form.controls['ecommerce'].setValue(selected);
        } else {
            this.form.controls['ecommerce'].setValue(null);
        }
    }

    onSave() {

        if (this.form.invalid) {
            this.notificationService.showError('Complete los campos requeridos', 'Aviso')
            FormService.markFormGroupTouched(this.form)
            return;
        }


        const data = {
            ...this.form.getRawValue(),
            status: this.form.value.status === 1 || this.form.value.status === true ? 'active' : 'inactive',
        }
        let action = new CreateUser(data);


        if (this.type === 'edit' && this.id) {
            action = new UpdateUser(data, this.id)
        }


        if (this.form.valid) {
            this.store.dispatch(action).subscribe({
                complete: () => {
                    this.router.navigate(['/user']).then();
                }
            });
        }
    }

}
