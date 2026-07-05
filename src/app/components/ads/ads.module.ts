import { AdsComponent } from './ads.component';
import { AdsRoutingModule } from './ads-routing.module';
import { AdsState } from 'src/app/shared/state/ads.state';
import { CommonModule } from '@angular/common';
import { CreateAdsComponent } from './create-ads/create-ads.component';
import { EditAdsComponent } from './edit-ads/edit-ads.component';
import { FormAdsComponent } from './form-ads/form-ads.component';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ParameterState } from '@shared/state/parameter.state';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AdsComponent,
    FormAdsComponent,
    CreateAdsComponent,
    EditAdsComponent
  ],
  imports: [
    CommonModule,
    AdsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      AdsState,
      ParameterState
    ])
  ]
})
export class AdsModule { }
