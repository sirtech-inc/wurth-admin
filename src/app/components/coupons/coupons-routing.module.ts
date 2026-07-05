import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCouponsComponent } from './create-coupons/create-coupons.component';
import { EditCouponsComponent } from './edit-coupons/edit-coupons.component';
import { CouponsComponent } from './coupons.component';

const routes: Routes = [
  {
    path : 'create',
    component : CreateCouponsComponent,
  },
  {
    path: 'edit/:id',
    component : EditCouponsComponent
  },
  {
    path : '',
    component : CouponsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
