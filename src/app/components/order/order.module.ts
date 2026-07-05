import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { NgxsModule } from '@ngxs/store';
import { OrderState } from 'src/app/shared/state/order.state';
import { SharedModule } from '../../shared/shared.module';
import { CreateOrderComponent } from './create-order/create-order.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { FormOrderComponent } from './form-order/form-order.component';


@NgModule({
  declarations: [
    OrderComponent,
    CreateOrderComponent,
    DetailOrderComponent,
    EditOrderComponent,
    FormOrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      OrderState
    ])
  ]
})
export class OrderModule { }
