import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FormUserComponent } from './form-user/form-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user.state';
import { RoleState } from '@shared/state/role.state';
import { ParameterState } from '@shared/state/parameter.state';


@NgModule({
  declarations: [
    UserComponent,
    FormUserComponent,
    CreateUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      UserState,
      RoleState,
      ParameterState
    ])
  ]
})
export class UserModule { }
