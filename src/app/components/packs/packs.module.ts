import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacksRoutingModule } from './packs-routing.module';
import { PacksComponent } from './packs.component';
import { FormPacksComponent } from './form-packs/form-packs.component';
import { EditPacksComponent } from './edit-packs/edit-packs.component';
import { CreatePacksComponent } from './create-packs/create-packs.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { PackState } from '@shared/state/pack.state';
import { ParameterState } from '@shared/state/parameter.state';
import { ProductState } from '@shared/state/product.state';


@NgModule({
  declarations: [
    PacksComponent,
    FormPacksComponent,
    EditPacksComponent,
    CreatePacksComponent
  ],
  imports: [
    CommonModule,
    PacksRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      PackState,
      ParameterState,
      ProductState
    ])
  ]
})
export class PacksModule { }
