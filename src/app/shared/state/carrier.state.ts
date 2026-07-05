import {
    Carrier,
    CarrierRange,
    CarrierLocation,
    CarrierDepartment,
    CarrierRangeDepartmentCost, CarrierResponse
} from "@shared/interface/carrier.interface";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {Injectable, NgZone} from "@angular/core";
import {NotificationService} from "@shared/services/notification.service";
import {Router} from "@angular/router";
import {CarrierService} from "@shared/services/carrier.service";
import {
    CarrierDepartments,
    CarrierLoader,
    CarrierSaveOk,
    CreateUpdateCarrier,
    EditCarrier, GetCarriers
} from "@shared/action/carrier.action";
import {finalize, startWith, tap} from "rxjs";
import {HideLoaderAction, ResetLoaderStateAction, ShowButtonSpinnerAction, ShowLoaderAction} from "@shared/action";

export class CarrierStateModel {
    carrier = {
        datos: [] as Carrier[],
        total: 0
    }
    selectedCarrier: CarrierResponse | null
    selectedLocation: CarrierLocation | null
    selectedRange: CarrierRange | null
    selectedDepartment: CarrierDepartment | null
    selectedRangeDepartmentCost: CarrierRangeDepartmentCost | null

    selectedDepartments: CarrierDepartments[] | null

    carrierLoader: boolean
    savedOk: boolean

}

@State<CarrierStateModel>({
    name: "carrier",
    defaults: {
        carrier: {
            datos: [],
            total: 0
        },

        selectedCarrier: null,
        selectedLocation: null,
        selectedRange: null,
        selectedDepartment: null,
        selectedRangeDepartmentCost: null,

        selectedDepartments: null,

        savedOk: false,

        carrierLoader: false
    }
})
@Injectable()
export class CarrierState {

    constructor(
        private store: Store,
        private notificationService: NotificationService,
        private router: Router,
        private carrierService: CarrierService,
        private ngZone: NgZone
    ) {
    }

    @Selector()
    static carrier(state: CarrierStateModel) {
        return state.carrier;
    }

    @Selector()
    static selectedCarrier(state: CarrierStateModel) {
        return state.selectedCarrier;
    }

    @Selector()
    static selectedCarrierLoader(state: CarrierStateModel) {
        return state.carrierLoader;
    }

    @Selector()
    static selectedDepartments(state: CarrierStateModel) {
        return state.selectedDepartments;
    }

    @Selector()
    static selectedSavedOk(state: CarrierStateModel) {
        return state.savedOk;
    }

    @Action(GetCarriers)
    getCarriers(ctx: StateContext<CarrierStateModel>, action: GetCarriers) {
        this.store.dispatch(new ShowLoaderAction())
        return this.carrierService.getCarriers(action.payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        carrier: {
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
            }),
            finalize(() => {
                this.store.dispatch(new HideLoaderAction())
            })
        )
    }

    @Action(CarrierSaveOk)
    carrierSaveOk(ctx: StateContext<CarrierStateModel>, action: CarrierSaveOk) {
        ctx.patchState({
            savedOk: action.payload
        })
    }

    @Action(CarrierLoader)
    carrierLoader(ctx: StateContext<CarrierStateModel>, action: CarrierLoader) {
        ctx.patchState({
            carrierLoader: action.payload
        })
    }

    @Action(CreateUpdateCarrier)
    createUpdateCarrier(ctx: StateContext<CarrierStateModel>, action: CreateUpdateCarrier) {
        this.store.dispatch(new CarrierLoader(true))
        this.store.dispatch(new CarrierSaveOk(false))

        return this.carrierService.createUpdateCarrier(action.payload,).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        carrier: {
                            datos: [...ctx.getState().carrier.datos, result.datos],
                            total: ctx.getState().carrier.total + 1
                        },
                        selectedCarrier: result.datos
                    })
                    // this.notificationService.showSuccess(result.result.detail)
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            }),
            finalize(() => {

                this.store.dispatch(new CarrierLoader(false))
                const savedOk = this.store.selectSnapshot(CarrierState.selectedSavedOk)
                if (savedOk) {
                    this.notificationService.showSuccess('Se ha guardado correctamente')
                    this.ngZone.run(() => {
                        this.router.navigate(['/carriers'])
                    })
                }

            })
        )
    }

    @Action(CarrierDepartments)
    carrierDepartments(ctx: StateContext<CarrierStateModel>, action: CarrierDepartments) {
        // this.store.dispatch(new CarrierLoader(true))
        return this.carrierService.getDepartments().pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        selectedDepartments: result.datos.datos
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

    @Action(EditCarrier)
    editCarrier(ctx: StateContext<CarrierStateModel>, action: EditCarrier) {
        this.store.dispatch(new CarrierLoader(true))
        return this.carrierService.getCarrierById(action.payload).pipe(
            tap({
                next: (result) => {
                    if (result.datos === null && result.result === null) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/carriers']).then();
                        })
                        this.store.dispatch(new ResetLoaderStateAction())
                        throw new Error();
                    }
                    ctx.patchState({
                        selectedCarrier: result.datos
                    })
                },
                error: (err) => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    this.store.dispatch(new HideLoaderAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            }),
            finalize(() => {
                this.store.dispatch(new CarrierLoader(false))
            })
        )
    }

}