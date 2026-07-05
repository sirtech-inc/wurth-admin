import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { FormCustomerComponent } from './form-customer/form-customer.component';
import { CustomerComponent } from './customer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { CustomerState } from 'src/app/shared/state/customer.state';
import { ParameterState } from '@shared/state/parameter.state';


@NgModule({
  declarations: [
    CreateCustomerComponent,
    EditCustomerComponent,
    FormCustomerComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      CustomerState,
      ParameterState
      
    ])
  ]
})
export class CustomerModule { }
