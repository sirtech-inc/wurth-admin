import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
// import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent
  },
  {
    path: 'create',
    component :  CreateOrderComponent
  },
  {
    path: 'edit/:id',
    component: EditOrderComponent
  },
  {
    path: 'details/:id',
    component: DetailOrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
