import { Component, OnInit } from '@angular/core';
import { CurrencySymbolPipe } from './../../shared/pipe/currency-symbol.pipe';
import { Params, PedidoModel, TableClickedAction, TableConfig } from 'src/app/shared/interface';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DashboardState, DashboardStateModel } from '@shared/state/dashboard.state';
import { GetDashboard } from '@shared/action/dashboard.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CurrencySymbolPipe]
})
export class DashboardComponent implements OnInit {

  public dashboard: any = {
    total_sales: 0,
    total_orders: 0,
    total_new_users: 0
  };

  private destroy$ = new Subject<void>();

  @Select(DashboardState.dashboard) dashboard$ : Observable<DashboardStateModel>;

  constructor(private store: Store) {}

  public orderTableConfig: TableConfig = {
    columns: [
      { title: "dashaboard_last_orders_number", dataField: "numeroOrden" },
      { title: "dashaboard_last_orders_date", dataField: "fechaPedido" },
      { title: "dashaboard_last_orders_customer_name", dataField: "razonSocial" },
      { title: "dashaboard_last_orders_total_amount", dataField: "total", type: 'price' },
      { title: "dashaboard_last_orders_payment_status", dataField: "estado" },
    
    ],
    rowActions: [
      // { label: "View", actionToPerform: "view", icon: "ri-eye-line", }
    ],
    data: [] as PedidoModel[],
    total: 0
  };
 

  ngOnInit(): void {
    this.dashboard$.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.dashboard.total_sales = data?.ingresostotales || 0;
      this.dashboard.total_orders = data?.totalPedidos || 0;
      this.dashboard.total_new_users = data?.countUsuarioNuevos || 0;
      this.orderTableConfig.data = data?.datos || [];
      this.orderTableConfig.total = data?.total || 0;
    })
  }

  onTableChange(data?: Params) {
    console.log(data);
    this.store.dispatch(new GetDashboard());
  }
 
}
