import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { GetRoles } from '@shared/action/role.action';
import { TableClickedAction, TableConfig } from '@shared/interface';
import { Role, RoleModel } from '@shared/interface/role.interface';
import { RoleState } from '@shared/state/role.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: ``
})
export class RolesComponent implements OnInit, OnDestroy{

  @Select(RoleState.role) role$: Observable<RoleModel>;


  public tableConfig: TableConfig = {
    columns: [
      { title: "roles_table_code", dataField: "code" , sortable: true , colSmall: true, sort_direction : 'desc' },
      { title: "roles_table_name", dataField: "name",  sortable: true, alignment : 'left', sort_direction : 'desc' },
      { title: "roles_table_status", dataField: "status", alignment: 'left', translate: true },
      { title: "roles_table_created_at", dataField: "date_create", alignment:'left', sortable: true, sort_direction : 'desc' }
    ],
    rowActions: [
      { label: "global_edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "role.edit" },
    ],
    data: [] as Role[],
    total: 0
  };
  constructor(
    private store: Store,
    public router: Router
  ){}

  ngOnInit(): void {
     this.role$.subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
     })
  }
  ngOnDestroy(): void {
   
  }


  onTableChange(data?: any) {
    this.store.dispatch(new GetRoles(data));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data)
  }

  private edit(data: Role) {
    this.router.navigateByUrl(`/roles/edit/${data.code}`);
  }
  
}
