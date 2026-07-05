import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Order, OrderToSelect } from "../interface/order.interface";
import { GetOrders } from "@shared/action/order.action";
import { Router } from "@angular/router";
import { NotificationService } from "@shared/services/notification.service";
import { PedidoService } from "@shared/services/pedido.service";
import {of, tap} from "rxjs";

export class OrderStateModel {
    order = {
      datos: [] as Order[],
      total: 0
    }
    orderSelect = {
        datos: [] as OrderToSelect[],
    }
    selectedProduct: Order | null
    topSellingProducts: Order[]
}


@State<OrderStateModel>({
  name: "order",
  defaults: {
    order: {
          datos: [],
          total: 0
      },
      orderSelect: {
          datos: []
      },
      selectedProduct: null,
      topSellingProducts: []
  },
})
@Injectable()
export class OrderState {

   constructor(
          private pedidoService: PedidoService,
          private store: Store,
          private router: Router,
          private notificationService: NotificationService
      ) {
      }

  @Selector()
  static order(state: OrderStateModel) {
    return state.order;
  }

   @Action(GetOrders)
    getProducts(ctx: StateContext<OrderStateModel>, action: GetOrders) {
        return this.pedidoService.getOrden(action.payload).pipe(
            tap({
                next: (result) => {
                    ctx.patchState({
                        order: {
                            datos: result.datos.datos,
                            total: result.datos.count
                        },
                    });
                },
                error: (err) => {
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                },
            })
        );
    }
  
}