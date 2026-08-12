import { Action, Selector, State, StateContext, Store } from "@ngxs/store"
import { CreatePromotion, CreatePromotionBonusGiftAmount, CreatePromotionBonusGiftQuantity, CreatePromotionFinalPrice, CreatePromotionScale, EditPromotion, EditPromotionBonusGiftAmount, EditPromotionBonusGiftQuantity, EditPromotionFinalPrice, EditPromotionScale, GetPromotion, ImportCompleted, ImportPromotion, ResetImport, UpdatePromotion } from "@shared/action/promotion.action"
import { HideButtonSpinnerAction, HideLoaderAction, ResetLoaderStateAction } from "@shared/action"
import { ImportingPromotionBonusGiftAmount, ImportingPromotionBonusGiftQuantity, ImportingPromotionFinalPrice, ImportingPromotionScale } from './../action/promotion.action';
import { Injectable, NgZone } from "@angular/core"
import { PrepareItemPostResponse, PrepareOption, Promotion } from "@shared/interface"
import { concatMap, delay, from, tap, toArray } from "rxjs"

import { NotificationService } from "@shared/services/notification.service"
import { OptionalAll } from "@shared/types/util.types"
import { PromotionService } from "@shared/services/promotion.service"
import { Router } from "@angular/router"

export class PromotionStateModel {
    promotion = {
        datos: [] as Promotion[],
        total: 0
    }
    selectedPromotion: Promotion | null
    selectedPromotionItems: OptionalAll<PrepareOption>[] | null

    importingScale: boolean
    importingFinalPrice: boolean
    importingBonusGiftAmount: boolean
    importingBonusGiftQuantity: boolean

    completed: boolean
}

@State<PromotionStateModel>({
    name: "promotion",
    defaults: {
        promotion: {
            datos: [],
            total: 0
        },
        selectedPromotion: null,
        selectedPromotionItems: null,

        importingScale: false,
        importingFinalPrice: false,
        importingBonusGiftAmount: false,
        importingBonusGiftQuantity: false,
        completed: false
    },
})
@Injectable()
export class PromotionState {
    constructor(
        private promotionService: PromotionService,
        private store: Store,
        private router: Router,
        private notificationService: NotificationService,
        private ngZone: NgZone
    ) { }

    @Selector()
    static promotion(state: PromotionStateModel) {
        return state.promotion;
    }

    @Selector()
    static selectedPromotion(state: PromotionStateModel) {
        return state.selectedPromotion;
    }

    @Selector()
    static selectedPromotionItems(state: PromotionStateModel) {
        return state.selectedPromotionItems;
    }

    @Selector()
    static importingScale(state: PromotionStateModel) {
        return state.importingScale;
    }
    @Selector()
    static importingFinalPrice(state: PromotionStateModel) {
        return state.importingFinalPrice;
    }
    @Selector()
    static importingBonusGiftAmount(state: PromotionStateModel) {
        return state.importingBonusGiftAmount;
    }
    @Selector()
    static importingBonusGiftQuantity(state: PromotionStateModel) {
        return state.importingBonusGiftQuantity;
    }

    @Selector()
    static completed(state: PromotionStateModel) {
        return state.completed;
    }

    @Action(ResetImport)
    resetImport(ctx: StateContext<PromotionStateModel>) {
        ctx.patchState({
            completed: false,
            importingScale: false,
            importingFinalPrice: false,
            importingBonusGiftAmount: false,
            importingBonusGiftQuantity: false
        })
    }


    @Action(ImportCompleted)
    importCompleted(ctx: StateContext<PromotionStateModel>, { payload }: ImportCompleted) {
        ctx.patchState({
            completed: payload
        })
    }




    @Action(ImportingPromotionScale)
    importingPromotionScale(ctx: StateContext<PromotionStateModel>, { payload }: ImportingPromotionScale) {
        ctx.patchState({
            importingScale: payload
        })
    }
    @Action(ImportingPromotionFinalPrice)
    importingPromotionFinalPrice(ctx: StateContext<PromotionStateModel>, { payload }: ImportingPromotionFinalPrice) {
        ctx.patchState({
            importingFinalPrice: payload
        })
    }
    @Action(ImportingPromotionBonusGiftAmount)
    importingPromotionBonusGiftAmount(ctx: StateContext<PromotionStateModel>, { payload }: ImportingPromotionBonusGiftAmount) {
        ctx.patchState({
            importingBonusGiftAmount: payload
        })
    }
    @Action(ImportingPromotionBonusGiftQuantity)
    importingPromotionBonusGiftQuantity(ctx: StateContext<PromotionStateModel>, { payload }: ImportingPromotionBonusGiftQuantity) {
        ctx.patchState({
            importingBonusGiftQuantity: payload
        })
    }

    @Action(GetPromotion)
    getPromotion(ctx: StateContext<PromotionStateModel>, { payload }: GetPromotion) {
        return this.promotionService.getPromotion(payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        promotion: {
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
                    // this.notificationService.showError(error.error.result.message);
                }
            })
        )
    }

    @Action(UpdatePromotion)
    updatePromotion(ctx: StateContext<PromotionStateModel>, { payload }: UpdatePromotion) {

        return this.promotionService.updatePromotion(payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        this.store.dispatch(new HideButtonSpinnerAction())
                        this.notificationService.showError('No se pudo actualizar la promoción', 'Aviso')
                        return;
                    }

                    const state = ctx.getState();
                    const promotion = state.promotion.datos;

                    if (payload.type === 'escala') {
                        this.store.dispatch(new CreatePromotionScale({
                            idPromotion: result.datos.code,
                            items: payload.products
                        }))
                    }
                    if (payload.type === 'precio-final') {
                        this.store.dispatch(new CreatePromotionFinalPrice({
                            idPromotion: result.datos.code,
                            items: payload.products
                        }))
                    }
                    if (payload.type === 'lleva-gratis') {
                        if (payload.condition_promotion === 1) {
                            this.store.dispatch(new CreatePromotionBonusGiftAmount({
                                idPromotion: result.datos.code,
                                amount: payload.amount,
                                items: payload.products
                            }))
                        }
                        if (payload.condition_promotion === 2) {
                            this.store.dispatch(new CreatePromotionBonusGiftQuantity({
                                idPromotion: result.datos.code,
                                items: payload.products
                            }))
                        }
                    }

                    const index = promotion.findIndex((item) => item.code === payload.code);
                    promotion[index] = result.datos;

                    ctx.setState({
                        ...state,
                        promotion: {
                            datos: promotion,
                            total: state.promotion.total
                        }
                    })

                    this.notificationService.showSuccess(result.result.detail);
                    this.ngZone.run(() => {
                        this.router.navigate(["/promotions"]);
                    })
                },
                error: (error) => {
                    this.notificationService.showError(error?.error?.result?.message || 'No se pudo actualizar la promoción', 'Aviso');
                }
            })
        )
    }

    @Action(CreatePromotion)
    createPromotion(ctx: StateContext<PromotionStateModel>, { payload }: CreatePromotion) {
        const _payload = {
            ...payload
        }
        delete _payload.amount;
        delete _payload.quantity;

        return this.promotionService.createPromotion(_payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        this.notificationService.showError('No se pudo crear la promoción', 'Aviso')
                        return;
                    }

                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        promotion: {
                            datos: [...state.promotion.datos, result.datos],
                            total: state.promotion.total + 1
                        }
                    });

                    this.notificationService.showSuccess(result.result.detail);

                    if (payload.type === 'escala') {
                        this.store.dispatch(new CreatePromotionScale({
                            idPromotion: result.datos.code,
                            items: payload.products
                        }))
                    }
                    if (payload.type === 'precio-final') {
                        this.store.dispatch(new CreatePromotionFinalPrice({
                            idPromotion: result.datos.code,
                            items: payload.products
                        }))
                    }
                    if (payload.type === 'lleva-gratis') {
                        if (payload.condition_promotion === 1) {
                            this.store.dispatch(new CreatePromotionBonusGiftAmount({
                                idPromotion: result.datos.code,
                                amount: payload.amount,
                                items: payload.products
                            }))
                        }
                        if (payload.condition_promotion === 2) {
                            this.store.dispatch(new CreatePromotionBonusGiftQuantity({
                                idPromotion: result.datos.code,
                                items: payload.products
                            }))
                        }
                    }
                },
                error: (error) => {
                    this.notificationService.showError(error?.error?.result?.message || 'No se pudo crear la promoción', 'Aviso');
                }
            })
        )
    }

    @Action(ImportPromotion)
    importPromotion(ctx: StateContext<PromotionStateModel>, { payload }: ImportPromotion) {
        from(payload.items).pipe(
            delay(1000),
            concatMap((item) =>
                this.promotionService.importPromotion(item)
            ),
            toArray()
        ).subscribe({
            next: (result) => {

                if (payload.type === 'escala') this.store.dispatch(new ImportingPromotionScale(false))
                if (payload.type === 'precio-final') this.store.dispatch(new ImportingPromotionFinalPrice(false))

                if (payload.type === 'lleva-gratis' && payload.condition === 2) this.store.dispatch(new ImportingPromotionBonusGiftQuantity(false))
                if (payload.type === 'lleva-gratis' && payload.condition === 1) {
                    this.store.dispatch(new ImportCompleted(true))
                    this.store.dispatch(new ImportingPromotionBonusGiftAmount(false))
                }
                // this.ngZone.run(() => {
                // this.router.navigate(["/promotions"]);
                // })
            },
            error: (error) => {

            }
        })
    }

    @Action(CreatePromotionScale)
    createPromotionScale(ctx: StateContext<PromotionStateModel>, { payload }: CreatePromotionScale) {
        const data = payload.items.filter(x => x.code == 0)
        const items: OptionalAll<PrepareItemPostResponse>[] = data.map((item) => {
            return {
                discount: item.discount,
                fk_code: 0,
                fk_product: item.fk_product,
                fk_promotion: payload.idPromotion,
                maximum_quantity: item.quantity_max,
                minimum_quantity: item.quantity_min
            }
        })
        if (items) {
            from(items).pipe(
                concatMap((item) => this.promotionService.createPromotionScale(item)),
                toArray()
            ).subscribe({
                next: (result) => {
                    this.ngZone.run(() => {
                        this.router.navigate(["/promotions"]);
                    })
                },
                error: (error) => {

                }
            })
        }
    }

    @Action(CreatePromotionFinalPrice)
    createPromotionFinalPrice(ctx: StateContext<PromotionStateModel>, { payload }: CreatePromotionFinalPrice) {

        const data = payload.items.filter(x => x.code == 0)
        
        const items: OptionalAll<PrepareItemPostResponse>[] = data.map((item) => {
            const _item: OptionalAll<PrepareItemPostResponse> = {
                discount: item.discount,
                fk_code: 0,
                code: item.code,
                fk_product: item.fk_product,
                fk_promotion: payload.idPromotion,
                minimum_quantity: item.quantity_min
            }
            return _item
        })

        if (items) {
            from(items).pipe(
                concatMap((item) => this.promotionService.createPromotionFinalPrice(item)),
                toArray()
            ).subscribe({
                next: (result) => {
                    this.ngZone.run(() => {
                        this.router.navigate(["/promotions"]);
                    })
                },
                error: (error) => {

                }
            })
        }
    }

    @Action(CreatePromotionBonusGiftAmount)
    createPromotionBonusGiftAmount(ctx: StateContext<PromotionStateModel>, { payload }: CreatePromotionBonusGiftAmount) {

        const data = payload.items.filter(x => x.code == 0)
        const items: OptionalAll<PrepareItemPostResponse>[] = data.map((item) => {
            const _item: OptionalAll<PrepareItemPostResponse> = {
                fk_code: 0,
                fk_product: item.fk_product,
                fk_promotion: payload.idPromotion,
                amount: Number(payload.amount) || 0
            }
            return _item
        })

        if (items) {
            from(items).pipe(
                concatMap((item) => this.promotionService.createPromotionBonusGiftAmount(item)),
                toArray()
            ).subscribe({
                next: (result) => {
                    this.ngZone.run(() => {
                        this.router.navigate(["/promotions"]);
                    })
                },
                error: (error) => {

                }
            })
        }
    }

    @Action(CreatePromotionBonusGiftQuantity)
    createPromotionBonusGiftQuantity(ctx: StateContext<PromotionStateModel>, { payload }: CreatePromotionBonusGiftQuantity) {

        const data = payload.items.filter(x => x.code == 0)
        const items: OptionalAll<PrepareItemPostResponse>[] = data.map((item) => {
            const _item: OptionalAll<PrepareItemPostResponse> = {
                fk_code: 0,
                fk_product: item.fk_product,
                fk_promotion: payload.idPromotion,
                //  `quantity` es el umbral de piezas del carrito que dispara la promoción, no una
                //  cantidad del producto. Se guarda replicado en cada fila, igual que `amount` en
                //  "lleva gratis por monto".
                quantity: Number(item.quantity) || 0,
                //  El regalo siempre es gratis: no se guarda el descuento que venga de la fila.
                discount: 100
            }
            return _item
        })

        if (items) {
            from(items).pipe(
                concatMap((item) => this.promotionService.createPromotionBonusGiftQuantity(item)),
                toArray()
            ).subscribe({
                next: (result) => {
                    this.ngZone.run(() => {
                        this.router.navigate(["/promotions"]);
                    })
                },
                error: (error) => {

                }
            })
        }
    }

    @Action(EditPromotion)
    editPromotion(ctx: StateContext<PromotionStateModel>, { payload }: EditPromotion) {
        return this.promotionService.editPromotion(payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/promotions']).then();
                        })
                        this.store.dispatch(new ResetLoaderStateAction());
                        return;
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedPromotion: result.datos
                    })

                    if (result.datos.type === 'escala') this.store.dispatch(new EditPromotionScale(result.datos.code))
                    if (result.datos.type === 'precio-final') this.store.dispatch(new EditPromotionFinalPrice(result.datos.code))
                    if (result.datos.type === 'lleva-gratis' && result.datos.condition_promotion === 1) this.store.dispatch(new EditPromotionBonusGiftAmount(result.datos.code))
                    if (result.datos.type === 'lleva-gratis' && result.datos.condition_promotion === 2) this.store.dispatch(new EditPromotionBonusGiftQuantity(result.datos.code))

                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.router.navigate(["/promotions"])
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }

    @Action(EditPromotionScale)
    editPromotionScale(ctx: StateContext<PromotionStateModel>, { payload }: EditPromotionScale) {
        return this.promotionService.editPromotionScale(payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos) {

                        const state = ctx.getState();
                        // const selectedPromotion = state.selectedPromotion;
                        const prepare: OptionalAll<PrepareOption>[] = result.datos.map((item, index) => {
                            const _item: OptionalAll<PrepareOption> = {
                                code: item.fk_product,
                                name: item.name,
                                reference: item.reference,
                                discount: item.discount,
                                quantity_max: item.maximum_quantity,
                                quantity_min: item.minimum_quantity,
                                quantity: 0,
                                item: index + 1
                            }
                            return _item
                        });
                        // selectedPromotion.products = prepare;
                        ctx.patchState({
                            ...ctx.getState(),
                            selectedPromotionItems: prepare
                        })
                        // ctx.patchState({
                        //     ...ctx.getState(),
                        //     selectedPromotion: selectedPromotion
                        // })
                    }
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }

    @Action(EditPromotionFinalPrice)
    editPromotionFinalPrice(ctx: StateContext<PromotionStateModel>, { payload }: EditPromotionFinalPrice) {
        return this.promotionService.editPromotionFinalPrice(payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos) {
                        const state = ctx.getState();
                        // const selectedPromotion = state.selectedPromotion;
                        const prepare: OptionalAll<PrepareOption>[] = result.datos.map((item, index) => {
                            const _item: OptionalAll<PrepareOption> = {
                                code: item.code,
                                name: item.name,
                                reference: item.reference,
                                discount: item.discount,
                                quantity_max: 0,
                                quantity_min: item.minimum_quantity,
                                quantity: 0,
                                fk_product: item.fk_product,
                                item: index + 1
                            }
                            return _item
                        });
                        // selectedPromotion.products = prepare;
                        ctx.patchState({
                            ...ctx.getState(),
                            selectedPromotionItems: prepare
                            // selectedPromotion: selectedPromotion
                        })
                    }
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }

    @Action(EditPromotionBonusGiftAmount)
    editPromotionBonusGiftAmount(ctx: StateContext<PromotionStateModel>, { payload }: EditPromotionBonusGiftAmount) {
        return this.promotionService.editPromotionBonusGiftAmount(payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos) {
                        const state = ctx.getState();
                        const selectedPromotion = state.selectedPromotion ? {
                            ...state.selectedPromotion,
                            amount: result.datos[0].amount
                        } : state.selectedPromotion;

                        const prepare: PrepareOption[] = result.datos.map((item, index) => {
                            const _item: PrepareOption = {
                                code: item.fk_product,
                                name: item.name,
                                fk_product: item.fk_product,
                                reference: item.reference,
                                discount: 0,
                                quantity_max: 0,
                                quantity_min: 0,
                                quantity: 0,
                                item: index + 1,
                                amount: item.amount
                            }
                            return _item
                        });

                        ctx.patchState({
                            selectedPromotion,
                            selectedPromotionItems: prepare
                        })
                    }
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }

    @Action(EditPromotionBonusGiftQuantity)
    editPromotionBonusGiftQuantity(ctx: StateContext<PromotionStateModel>, { payload }: EditPromotionBonusGiftQuantity) {
        return this.promotionService.editPromotionBonusGiftQuantity(payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos) {
                        const prepare: OptionalAll<PrepareOption>[] = result.datos.map((item, index) => {
                            const _item: OptionalAll<PrepareOption> = {
                                code: item.fk_product,
                                name: item.name,
                                reference: item.reference,
                                discount: item.discount,
                                quantity_max: 0,
                                quantity_min: 0,
                                quantity: item.quantity,
                                item: index + 1
                            }
                            return _item
                        });
                        ctx.patchState({
                            ...ctx.getState(),
                            selectedPromotionItems: prepare
                        })
                    }
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message)
                    }
                }
            })
        )
    }




}