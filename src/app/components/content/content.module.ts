import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import {NgxsModule} from "@ngxs/store";
import {ParameterState} from "@shared/state/parameter.state";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ContentRoutingModule,
      NgxsModule.forFeature([
          ParameterState
      ])
  ]
})
export class ContentModule { }
