import {Action, Selector, State, StateContext, Store} from "@ngxs/store"
import {CreateCoupon, EditCoupon, GetCoupon, UpdateCoupon} from "@shared/action/coupons.action"
import {HideLoaderAction, ResetLoaderStateAction} from "@shared/action"
import {Injectable, NgZone} from "@angular/core"

import {Coupon} from "@shared/interface/coupon.interface"
import {CouponService} from "@shared/services/coupon.service"
import {NotificationService} from "@shared/services/index.service"
import {Router} from "@angular/router"
import {tap} from "rxjs"

export class CouponStateModel {
    coupon = {
        datos: [] as Coupon[],
        total: 0
    }
    selectedCoupon: Coupon | null
}

@State<CouponStateModel>({
    name: "coupon",
    defaults: {
        coupon: {
            datos: [],
            total: 0
        },
        selectedCoupon: null
    }
})
@Injectable()
export class CouponState {

    constructor(
        private store: Store,
        private notificationService: NotificationService,
        private router: Router,
        private couponService: CouponService,
        private ngZone: NgZone
    ) {
    }


    @Selector()
    static coupon(state: CouponStateModel) {
        return state.coupon;
    }

    @Selector()
    static selectedCoupon(state: CouponStateModel) {
        return state.selectedCoupon;
    }

    @Action(GetCoupon)
    getCoupons(ctx: StateContext<CouponStateModel>, {payload}: GetCoupon) {
        return this.couponService.getCoupons(payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        coupon: {
                            datos: result.datos.datos,
                            total: result.datos.count
                        }
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                }
            })
        )
    }

    @Action(CreateCoupon)
    createCoupon(ctx: StateContext<CouponStateModel>, action: CreateCoupon) {
        return this.couponService.createCoupon(action.payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        coupon: {
                            datos: [...ctx.getState().coupon.datos, result.datos],
                            total: ctx.getState().coupon.total + 1
                        },
                        selectedCoupon: result.datos
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

    @Action(EditCoupon)
    editCoupon(ctx: StateContext<CouponStateModel>, action: EditCoupon) {
        return this.couponService.editCoupon(action.payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/coupons']).then();
                        })
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        ...ctx.getState(),
                        selectedCoupon: result.datos
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

    @Action(UpdateCoupon)
    updateCoupon(ctx: StateContext<CouponStateModel>, {payload, id}: UpdateCoupon) {
        return this.couponService.updateCoupon(id, payload).pipe(
            tap({
                next: (result) => {

                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }

                    ctx.patchState({
                        ...ctx.getState(),
                        selectedCoupon: result.datos
                    })

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