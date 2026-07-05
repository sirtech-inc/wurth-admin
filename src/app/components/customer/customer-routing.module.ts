import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateCustomerComponent
  },
  {
    path: 'edit/:id',
    component : EditCustomerComponent
  },
  {
    path: '',
    component : CustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
