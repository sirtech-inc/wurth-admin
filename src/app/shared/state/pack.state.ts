import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { CreatePack, EditPack, GetPacks, UpdatePack } from "@shared/action/pack.action";
import { HideLoaderAction, ResetLoaderStateAction } from "@shared/action";
import { Injectable, NgZone } from "@angular/core";

import { NotificationService } from "@shared/services/index.service";
import { Pack } from "@shared/interface/pack.interface";
import { PackService } from "@shared/services/pack.service";
import { Router } from "@angular/router";
import { tap } from "rxjs";

export class PackStateModel {
    pack = {
        datos: [] as Pack[],
        total: 0
    }
    selectedPack: Pack | null
}

@State<PackStateModel>({
    name: "pack",
    defaults: {
        pack: {
            datos: [],
            total: 0
        },
        selectedPack: null
    }
})
@Injectable()
export class PackState {
    constructor(
        private store: Store,
        private notificationService: NotificationService,
        private router: Router,
        private packService: PackService,
        private ngZone: NgZone
    ) { }

    @Selector()
    static pack(state: PackStateModel) {
        return state.pack;
    }

    @Selector()
    static selectedPack(state: PackStateModel) {
        return state.selectedPack;
    }

    @Action(GetPacks)
    getPacks(ctx: StateContext<PackStateModel>, { payload }: GetPacks) {
        return this.packService.getPacks(payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        pack: {
                            datos: result.datos.datos,
                            total: result.datos.count
                        }
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }


    @Action(CreatePack)
    createPack(ctx: StateContext<PackStateModel>, action: CreatePack) {
        return this.packService.createPack(action.payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        pack: {
                            datos: [...ctx.getState().pack.datos, result.datos],
                            total: ctx.getState().pack.total + 1
                        },
                        selectedPack: result.datos
                    })

                    this.notificationService.showSuccess(result.result.detail)
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

    @Action(EditPack)
    editPack(ctx: StateContext<PackStateModel>, { payload }: EditPack) {
        return this.packService.editPack(payload).pipe(
            tap({

                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/packs']).then();
                        })

                        this.store.dispatch(new ResetLoaderStateAction());
                        throw new Error();
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedPack: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.router.navigate(["/packs"])
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }

    @Action(UpdatePack)
    updatePack(ctx: StateContext<PackStateModel>, { payload, id }: any) {
        return this.packService.updatePack(payload, id).pipe(
            tap({
                next: (result) => {


                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedPack: result.datos
                    })

                    // ctx.patchState({
                    //     pack: {
                    //         datos: ctx.getState().pack.datos.map((pack) => {
                    //             if (pack.code === id) {
                    //                 return result.datos
                    //             }
                    //             return pack
                    //         }),
                    //         total: ctx.getState().pack.total
                    //     },
                    //     selectedPack: result.datos
                    // })

                    this.notificationService.showSuccess(result.result.detail)

                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }

}