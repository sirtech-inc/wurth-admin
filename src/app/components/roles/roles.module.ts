import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { FormRolesComponent } from './form-roles/form-roles.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { CreateRolesComponent } from './create-roles/create-roles.component';
import { SharedModule } from '@shared/shared.module';
import { PermissionsComponent } from './permissions/permissions.component';
import { NgxsModule } from '@ngxs/store';
import { RoleState } from '@shared/state/role.state';


@NgModule({
  declarations: [
    RolesComponent,
    FormRolesComponent,
    EditRolesComponent,
    CreateRolesComponent,
    PermissionsComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ RoleState ])
  ]
})
export class RolesModule { }
