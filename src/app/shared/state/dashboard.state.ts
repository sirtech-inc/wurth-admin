import { Injectable } from "@angular/core";
import { Action, StateContext, Selector, State } from "@ngxs/store";
import { GetDashboard } from "@shared/action/dashboard.action";
import { PedidoModel } from "@shared/interface";
import { PedidoService } from "@shared/services/pedido.service";
import { tap } from "rxjs";

export class DashboardStateModel {
    dashboard = {
        datos: [] as PedidoModel[],
        total: 0,
        countUsuarioNuevos: '',
        totalPedidos: '',
        ingresostotales: ''
    }
}

@State<DashboardStateModel>({
    name: "dashboard",
    defaults: {
        dashboard: {
            datos: [],
            total: 0,
            countUsuarioNuevos: '',
            totalPedidos: '',
            ingresostotales: ''
        },
    }
})
@Injectable()
export class DashboardState {

    constructor(
        private dashboardService: PedidoService
    ) {}


    @Selector()
    static dashboard(state: DashboardStateModel) {
        return state.dashboard;
    }

    @Action(GetDashboard)
    getDashboard(ctx: StateContext<DashboardStateModel>) {
        return this.dashboardService.getPedido().pipe(
            tap({
                next: result => {
                    ctx.patchState({
                        dashboard: {
                            datos: result.pedido || [],
                            total: result?.pedido?.length || 0,
                            countUsuarioNuevos: result?.countUsuarioNuevos || '',
                            totalPedidos: result?.totalPedidos || '',
                            ingresostotales: result?.ingresostotales || ''
                        }
                    })
                },
                error: err => {
                    if(err?.error?.message){
                        throw new Error(err?.error?.message);
                    }
                }
            })
        )
    }

}