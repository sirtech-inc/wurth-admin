import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { GetOrders } from '@shared/action/order.action';
import { Observable } from 'rxjs';
import { Order, OrderModel, TableClickedAction, TableConfig } from 'src/app/shared/interface';
import { OrderState } from 'src/app/shared/state/order.state';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {

  @Select(OrderState.order) order$: Observable<OrderModel>;

  private currentParams: Params = {};
  private readonly defaultPaginate = 10;
  public filters = {
    orderNumber: ''
  };

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "orders_number", dataField: "numeroOrden" },
      { title: "orders_date", dataField: "fechaPedido" },
      { title: "orders_customer_name", dataField: "razonSocial" },
      { title: "orders_total_amount", dataField: "total", type: 'price' },
      { title: "orders_payment_status", dataField: "estado" },
    ],
    rowActions: [
      {
        label: "Ver",
        actionToPerform: "edit",
        icon: "ri-eye-line",
        permission: "order.edit",
      },
    ],
    data: [],
    total: 0
  };

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
    this.order$.subscribe((data) => {
      //this.tableConfig.data = data.datos;
      this.tableConfig.data = data.datos.map((item: any) => ({
        ...item,
     
      }));
      this.tableConfig.total = data.total;
    });
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
  }

  private edit(data: Order) {
    this.router.navigateByUrl(`/orders/edit/${data.numeroOrden}`);
  }

  private parseDateString(dateStr: string): Date {
    if (!dateStr) return null as any;
    // Espera formato dd/MM/yyyy HH:mm:ss
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  onTableChange(data?: Params) {
    const incomingParams = data || {};
    this.currentParams = {
      ...this.currentParams,
      ...incomingParams,
      paginate: Number(incomingParams?.['paginate'] || this.currentParams?.['paginate'] || this.defaultPaginate),
      page: Number(incomingParams?.['page'] || this.currentParams?.['page'] || 1)
    };

    const params: Params = {
      ...this.currentParams,
      filter_code: this.filters.orderNumber || ''
    };
    this.store.dispatch(new GetOrders(params));
  }

  applyFilters() {
    this.onTableChange({ ...this.currentParams, page: 1 });
  }

  clearFilters() {
    this.filters.orderNumber = '';
    this.onTableChange({ page: 1 });
  }

}
