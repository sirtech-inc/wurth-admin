import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TableClickedAction, TableConfig, User, UserModel } from '@shared/interface';

import { GetUsers } from '@shared/action';
import { HideLoaderAction } from './../../shared/action/loader.action';
import { LoaderState } from '@shared/state/loader.state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserState } from '@shared/state/user.state';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: ``
})
export class UserComponent implements OnInit {

  @Select(UserState.user) user$: Observable<UserModel>;



  public tableConfig: TableConfig = {
    columns: [
      { title: "users_table_code", dataField: "code", sortable: true, sort_direction: 'desc' },
      { title: "users_table_name", dataField: "name", sortable: true, alignment: 'left', sort_direction: 'desc' },
      { title: "users_table_lastname", dataField: "lastname", sortable: true, alignment: 'left', sort_direction: 'desc' },
      { title: "users_table_email", dataField: "email", sortable: true, alignment: 'left', sort_direction: 'desc' },
      { title: "users_table_role", dataField: "role", alignment: 'left' },
      { title: "users_table_status", dataField: "status", alignment: 'center', translate: true },
      { title: "users_table_created_at", dataField: "date_create", sortable: true, alignment: 'left', sort_direction: 'desc' },
    ],
    rowActions: [
      { label: "global_edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "user.edit" }
    ],
    data: [] as User[],
    total: 0
  };

  constructor(
    private store: Store,
    public router: Router
  ) { }


  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data)
  }

  private edit(data: User) {
    this.router.navigateByUrl(`/user/edit/${data.code}`);
  }

  ngOnInit(): void {
    this.user$.subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    })
  }

  onTableChange(data?: any) {
    this.store.dispatch(new GetUsers(data));
  }

}
