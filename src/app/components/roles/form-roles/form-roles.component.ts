import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, mergeMap, of, switchMap, takeUntil } from "rxjs";

import { Select, Store } from "@ngxs/store";
// import { Validators } from "ngx-editor";

import { CreateRole, UpdateRole } from "@shared/action/role.action";
import { EditRole } from "@shared/action/role.action";
import { Role } from "@shared/interface/role.interface";
import { RoleState } from "@shared/state/role.state";
import { TypeForm } from "@shared/types/util.types";
@Component({
  selector: "app-form-roles",
  templateUrl: "./form-roles.component.html",
  styles: ``,
})
export class FormRolesComponent implements OnInit, OnDestroy {
  @Input() type: TypeForm;

  @Select(RoleState.selectedRole) selectedRole$: Observable<Role>;

  public form: FormGroup;
  public id: number;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const _id = params["id"] || 0;
          return this.store
            .dispatch(new EditRole(_id))
            .pipe(
              mergeMap(() =>
                this.store.select(RoleState.selectedRoleAndPermission)
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((role) => {
        this.id = role.rol.code;
        this.form.patchValue({
          rol: {
            name: role.rol.name,
            status: role.rol.status === "active" ? true : false,
          },
        });
      });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      rol: this.fb.group({
        name: [null, [Validators.required]],
        status: [false, [Validators.required]],
      }),
      permission: this.fb.array([this.createPermissionsGroup()]),
    });
  }

  get childFormGroup() {
    return (field: string) => {
      return this.form.get(field) as FormGroup;
    };
  }

  get name() {
    return this.childFormGroup("rol").get("name");
  }

  private createPermissionsGroup() {
    return this.fb.group({
      fk_module: [null],
      view: [null],
      edit: [null],
      create: [null],
      delete: [null],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    this.form.markAllAsTouched();

    const selectedPermission = this.store
      .selectSnapshot(RoleState.selectedPermission)
      .map((permission) => {
        const data = {
          ...permission,
          view: permission.view ? permission.view : "inactive",
          edit: permission.edit ? permission.edit : "inactive",
          create: permission.create ? permission.create : "inactive",
          delete: permission.delete ? permission.delete : "inactive",
        };
        return data;
      });

    const data = {
      ...this.form.getRawValue(),
      rol: {
        ...this.form.value.rol,
        status: this.form.value.rol.status ? "active" : "inactive",
      },
      permission: selectedPermission,
    };

    let action = new CreateRole(data);

    if (this.type === "edit") {
      action = new UpdateRole(data, this.id);
    }

    if (this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          this.router.navigateByUrl("/roles");
        },
      });
    }
  }
}
