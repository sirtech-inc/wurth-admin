import { CommonModule } from '@angular/common';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { EditPromotionComponent } from './edit-promotion/edit-promotion.component';
import { FormProductPromotionComponent } from './form-product-promotion/form-product-promotion.component';
import { FormPromotionComponent } from './form-promotion/form-promotion.component';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ParameterState } from '@shared/state/parameter.state';
import { ProductState } from '@shared/state/product.state';
import { PromotionComponent } from './promotion.component';
import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionState } from '@shared/state/promotion.state';
import { SharedModule } from '@shared/shared.module';
import { UploadPromotionComponent } from './upload-promotion/upload-promotion.component';

@NgModule({
  declarations: [
    PromotionComponent,
    FormPromotionComponent,
    CreatePromotionComponent,
    EditPromotionComponent,
    UploadPromotionComponent,
    FormProductPromotionComponent
  ],
  imports: [
    CommonModule,
    PromotionRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      ParameterState,
      PromotionState,
      ProductState
    ])
  ]
})
export class PromotionModule { }
