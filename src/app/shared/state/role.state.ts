import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { CreateRole, EditRole, GetRoles, GetRolesToSelect, UpdateRole } from "@shared/action/role.action";
import { HideLoaderAction, ResetLoaderStateAction } from "@shared/action";
import { Permission, Role, RolePermission, RoleToSelect } from "@shared/interface/role.interface";

import { Injectable } from "@angular/core";
import { NotificationService } from "@shared/services/notification.service";
import { RoleService } from "@shared/services/role.service";
import { Router } from "@angular/router";
import { Select2DataFormat } from "@shared/interface";
import { tap } from "rxjs";

// import { Module, Role, RoleToSelect } from "@shared/interface/role.interface";


// import { EditRole, GetRoles, GetRolesToSelect, UpdateRole } from '../action/role.action';







// export class RoleStateModel {
//     role = {
//         datos: [] as Role[],
//         total: 0
//     }
//     roleSelect = {
//         datos: [] as RoleToSelect[]
//     }
//     selectedRole: Role | null;
//     modules: Module[];
// }

export class RoleStateModel {
    role = {
        datos: [] as Role[],
        total: 0
    }
    roleSelect = {
        datos: [] as RoleToSelect[]
    }
    selectedRole: Role | null;
    selectedPermission: Permission[] | null;
    selectedRoleAndPermission: RolePermission | null
}

@State<RoleStateModel>({
    name: "role",
    defaults: {
        role: {
            datos: [],
            total: 0
        },
        roleSelect: {
            datos: []
        },
        selectedRole: null,
        selectedPermission: null,
        selectedRoleAndPermission: null
    },
})
@Injectable()
export class RoleState {

    constructor(private store: Store,
        private notificationService: NotificationService,
        private roleService: RoleService,
        private router: Router
    ) { }


    @Selector()
    static role(state: RoleStateModel) {
        return state.role;
    }

    @Selector()
    static selectedRole(state: RoleStateModel) {
        return state.selectedRole;
    }

    @Selector()
    static selectedRoleAndPermission(state: RoleStateModel) {
        return state.selectedRoleAndPermission;
    }

    @Selector()
    static selectRoleToSelect(state: RoleStateModel): Select2DataFormat<{}>[] {
        return state.roleSelect.datos.map(role => {
            return {
                value: role.code,
                label: role.name,
                other: {}
            }
        });
    }

    @Selector()
    static selectedPermission(state: RoleStateModel) {
        return state.selectedPermission;
    }


    @Action(GetRoles)
    getRoles(ctx: StateContext<RoleStateModel>, action: GetRoles) {
        return this.roleService.getRoles(action?.payload).pipe(
            tap({
                next: result => {
                    ctx.patchState({
                        role: {
                            datos: result.datos.datos,
                            total: result.datos.count
                        }
                    });
                },
                error: err => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        );
    }

    @Action(GetRolesToSelect)
    getRolesToSelect(ctx: StateContext<RoleStateModel>) {
        return this.roleService.getRolesToSelect().pipe(
            tap({
                next: result => {
                    ctx.patchState({
                        roleSelect: {
                            datos: result.datos.datos.map(role => {
                                return {
                                    code: role.code,
                                    name: role.name
                                }
                            })
                        }
                    });
                },
                error: err => {

                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        );
    }

    @Action(EditRole)
    edit(ctx: StateContext<RoleStateModel>, { id }: EditRole) {
        return this.roleService.getRoleById(id).pipe(
            tap({
                next: result => {

                    if (result.datos.rol === null && id > 0) {
                        // this.notificationService.showError('El rol no existe o no se encuentra disponible en estos momentos.')
                        // this.router.navigate(['/roles']);
                        this.store.dispatch(new ResetLoaderStateAction())
                        this.router.navigate(['/roles']);
                        throw new Error();
                    } else {

                        ctx.patchState({
                            ...ctx.getState(),
                            selectedRole: result.datos.rol,
                            selectedPermission: result.datos.permission,
                            selectedRoleAndPermission: result.datos
                        });

                    }


                },
                error: err => {
                    // this.router.navigate(['/roles']);
                    // this.store.dispatch(new HideLoaderAction())
                    // throw new Error(err?.error?.message);
                    this.store.dispatch(new HideLoaderAction())
                    this.router.navigate(['/roles']);
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

    @Action(CreateRole)
    create(ctx: StateContext<RoleStateModel>, { payload }: CreateRole) {
        return this.roleService.createRole(payload).pipe(
            tap({
                next: result => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }


                    ctx.patchState({
                        role: {
                            datos: [result.datos.rol, ...ctx.getState().role.datos],
                            total: ctx.getState().role.total + 1
                        }
                    });
                    this.notificationService.showSuccess(result.result.detail);
                },
                error: err => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.router.navigate(['/roles']);
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

    @Action(UpdateRole)
    update(ctx: StateContext<RoleStateModel>, { payload, id }: UpdateRole) {
        return this.roleService.updateRole(id, payload).pipe(
            tap({
                next: result => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        role: {
                            datos: ctx.getState().role.datos.map(role => role.code === id ? result.datos.rol : role),
                            total: ctx.getState().role.total
                        }
                    });
                    this.notificationService.showSuccess(result.result.detail);
                },
                error: err => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.router.navigate(['/roles']);
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

}