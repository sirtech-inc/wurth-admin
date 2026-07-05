import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { CustomerState } from 'src/app/shared/state/customer.state';
import { CustomerModel, Customer } from '../../shared/interface/customer.interface';
import { Observable } from 'rxjs';
import { TableClickedAction, TableConfig } from 'src/app/shared/interface';
import { Params, Router } from '@angular/router';
import { GetCustomers } from 'src/app/shared/action/customer.action';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

  @Select(CustomerState.customer) customer$: Observable<CustomerModel>;

  public tableConfig: TableConfig = {
    columns: [
          { title: "code", dataField: "code", sortable: true, sort_direction: 'desc' },
          { title: "name", dataField: "name", sortable: true, alignment: 'left', sort_direction: 'desc' },
          { title: "lastname", dataField: "lastname", sortable: true, alignment: 'left', sort_direction: 'desc' },
          { title: "type", dataField: "type", sortable: true, alignment: 'left', sort_direction: 'desc' },
          { title: "status", dataField: "status", alignment: 'center', translate: true },
          { title: "created_at", dataField: "date_create", sortable: true, alignment: 'left', sort_direction: 'desc' },
        ],
        rowActions: [
          { label: "global_edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "customers.edit" }
        ],
        data: [] as Customer[],
        total: 0
  };

  constructor(
    private store: Store,
    private router: Router
  ) { }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data)
  }

  private edit(data: Customer) {

    this.router.navigateByUrl(`/customers/edit/${data.code}`);
  }

  ngOnInit(): void {
    this.customer$.subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    })
  }

  onTableChange(data?: any) {
      this.store.dispatch(new GetCustomers(data));
  }

    
  


}
