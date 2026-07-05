import { Component, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Permission } from '@shared/interface/role.interface';
import { RoleState } from '@shared/state/index.state';
// import { Module } from '@shared/interface/role.interface';
// import { StrictPartialUsed } from '@shared/types/util.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styles: ``
})
export class PermissionsComponent {

  @Select(RoleState.selectedPermission) selectedPermission$: Observable<Permission[]>
  constructor() {}

}
