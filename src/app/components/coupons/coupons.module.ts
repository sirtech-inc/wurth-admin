import { CommonModule } from '@angular/common';
import { CouponState } from '@shared/state/coupon.state';
import { CouponsComponent } from './coupons.component';
import { CouponsRoutingModule } from './coupons-routing.module';
import { CreateCouponsComponent } from './create-coupons/create-coupons.component';
import { EditCouponsComponent } from './edit-coupons/edit-coupons.component';
import { FormCouponsComponent } from './form-coupons/form-coupons.component';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ParameterState } from '@shared/state/parameter.state';
import { ProductState } from '@shared/state/product.state';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    CouponsComponent,
    CreateCouponsComponent,
    EditCouponsComponent,
    FormCouponsComponent
  ],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      CouponState,
      ParameterState,
      ProductState
    ])
  ]
})
export class CouponsModule { }
