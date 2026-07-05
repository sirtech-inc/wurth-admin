import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Ads, AdsPositionResponseOrList, Design } from "../interface/ads.interface";
import { CreateAds, EditAds, EditAdsPosition, GetAds, GetDesign, ResetAds, UpdateAds } from "@shared/action/ads.action";
import { HideLoaderAction, ResetLoaderStateAction } from "@shared/action";

import { AdsService } from "@shared/services/ads.service";
import { Injectable } from "@angular/core";
import { NotificationService } from "@shared/services/notification.service";
import { Router } from "@angular/router";
import { tap } from "rxjs";

export class AdsStateModel {
  ads = {
    datos: [] as Ads[],
    total: 0
  }
  designs = {
    data: [] as Design[],
  }

  selectedAds: Ads | null;
  selectedAdsPosition: AdsPositionResponseOrList[] | null
}

@State<AdsStateModel>({
  name: "ads",
  defaults: {
    ads: {
      datos: [],
      total: 0
    },
    designs: {
      data: []
    },
    selectedAds: null,
    selectedAdsPosition: null
  },
})
@Injectable()
export class AdsState {

  constructor(
    private adsService: AdsService,
    private store: Store,
    private notificationService: NotificationService,
    private router: Router,

  ) { }

  @Selector()
  static ads(state: AdsStateModel) {
    return state.ads;
  }

  @Selector()
  static selectDesgin(state: AdsStateModel) {
    return state.designs.data;
  }

  @Selector()
  static selectedAds(state: AdsStateModel) {
    return state.selectedAds;
  }

  @Selector()
  static selectedAdsPosition(state: AdsStateModel) {
    return state.selectedAdsPosition;
  }


  @Action(GetAds)
  getAds(ctx: StateContext<AdsStateModel>, action: GetAds) {
    return this.adsService.getAds(action.payload).pipe(
      tap({
        next: (response) => {

          ctx.patchState({
            ads: {
              datos: response.datos.datos,
              total: response.datos.count
            }
          })
        },
        error: (error) => {
          if (error?.error?.message) {
            throw new Error(error?.error?.message);
          }
        }
      })
    )
  }

  @Action(EditAds)
  edit(ctx: StateContext<AdsStateModel>, { payload }: EditAds) {
    return this.adsService.getBannerById(payload).pipe(
      tap({
        next: (result) => {

          if (result.datos === null && result.datos === null) {
            this.store.dispatch(new ResetAds())
            this.store.dispatch(new ResetLoaderStateAction())
            this.router.navigate(['/ads']);
            throw new Error();
          }


          ctx.patchState({
            selectedAds: result.datos
          })

          this.store.dispatch(new EditAdsPosition(result.datos.code))

        },
        error: (error) => {
          if (error?.error?.message) {
            throw new Error(error?.error?.message);
          }
        }
      })
    )
  }

  @Action(CreateAds)
  createAds(ctx: StateContext<AdsStateModel>, { payload }: CreateAds) {
    return this.adsService.createBanner(payload.ads).pipe(
      tap({
        next: (result) => {

          if (result.datos === null && result.result === null) {
            this.store.dispatch(new ResetLoaderStateAction())
            throw new Error();
          }

          ctx.patchState({
            ads: {
              datos: [...ctx.getState().ads.datos, result.datos],
              total: ctx.getState().ads.total + 1
            },
            selectedAds: result.datos
          })

          this.notificationService.showSuccess(result.result.detail);

          if (payload.positions && Array.isArray(payload.positions) && payload.positions.length > 0) {
            const preparePosition = payload.positions.map((position) => {
              return {
                ...position,
                fk_banner: result.datos.code,
                v_fk_banner: result.datos.code
              }
            })

            this.adsService.createBannerPosition(preparePosition).subscribe({
              next: (response) => {
                this.notificationService.showSuccess(result.result.detail);
              },
              error: (error) => {
                this.store.dispatch(new ResetLoaderStateAction())
                this.store.dispatch(new HideLoaderAction())
                if (error?.error?.message) {
                  throw new Error(error?.error?.message);
                }
              }
            })
          }

        },
        error: (error) => {
          this.store.dispatch(new ResetLoaderStateAction())
          this.store.dispatch(new HideLoaderAction())
          if (error?.error?.message) {
            throw new Error(error?.error?.message);
          }
        }
      })
    )
  }

  @Action(UpdateAds)
  UpdateAds(ctx: StateContext<AdsStateModel>, { payload, id }: UpdateAds) {
    return this.adsService.updateBanner(id, payload.ads).pipe(
      tap({
        next: (result) => {

          if (result.datos === null && result.result === null) {
            this.store.dispatch(new ResetLoaderStateAction())
            throw new Error();
          }

          ctx.patchState({
            ads: {
              datos: ctx.getState().ads.datos.map((ads) => {
                if (ads.code === id) {
                  return result.datos
                }
                return ads
              }),
              total: ctx.getState().ads.total
            },
            selectedAds: result.datos
          })

          this.notificationService.showSuccess(result.result.detail);

          if (payload.positions && Array.isArray(payload.positions) && payload.positions.length > 0) {
            this.adsService.updateBannerPosition(payload.positions).subscribe({
              next: (response) => {
                this.notificationService.showSuccess(result.result.detail);
              },
              error: (error) => {
                this.store.dispatch(new ResetLoaderStateAction())
                this.store.dispatch(new HideLoaderAction())
                if (error?.error?.message) {
                  throw new Error(error?.error?.message);
                }
              }
            })
          }
        },
        error: (error) => {
          this.store.dispatch(new ResetLoaderStateAction())
          this.store.dispatch(new HideLoaderAction())
          if (error?.error?.message) {
            throw new Error(error?.error?.message);
          }
        }
      })
    )
  }


  @Action(EditAdsPosition)
  editPosition(ctx: StateContext<AdsStateModel>, { payload }: EditAdsPosition) {
    return this.adsService.getBannerPosition(payload).pipe(
      tap({
        next: (result) => {
          if (result.datos === null && result.result === null) {
            this.store.dispatch(new ResetLoaderStateAction())
            throw new Error();
          }

          ctx.patchState({
            selectedAdsPosition: result.datos.datos
          })

          // this.store.dispatch(new EditAdsPosition(payload))

          // this.notificationService.showSuccess(result.result.detail);
        },
        error: (error) => {

          this.store.dispatch(new ResetLoaderStateAction())
          this.store.dispatch(new HideLoaderAction())
          if (error?.error?.message) {
            throw new Error(error?.error?.message);
          }
        }
      })
    )
  }

  @Action(GetDesign)
  getDesign(ctx: StateContext<AdsStateModel>, action: GetDesign) {
    return this.adsService.getDesign(action.payload).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            designs: {
              data: response.datos.datos
            }
          })
        },
        error: (error) => {
          if (error?.error?.message) {
            throw new Error(error?.error?.message);
          }
        }
      })
    )
  }

  @Action(ResetAds)
  resetAds(ctx: StateContext<AdsStateModel>) {
    ctx.patchState({
      ...ctx.getState(),
      selectedAds: null,
      selectedAdsPosition: null,
      designs: null
    })
  }

}