import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductState} from "@shared/state/product.state";

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '@shared/shared.module';
import {FormSettingsComponent} from "@components/settings/form-settings/form-settings.component";
import {NgxsModule} from "@ngxs/store";
import {ParameterState} from "@shared/state/parameter.state";
import {SettingState} from "@shared/state/setting.state";


@NgModule({
  declarations: [
    SettingsComponent,
    FormSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
        ProductState,
        ParameterState,
        SettingState
    ])
  ]
})
export class SettingsModule { }
