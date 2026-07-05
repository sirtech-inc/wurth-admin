import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardState } from '@shared/state/dashboard.state';
import { ParameterState } from '@shared/state/parameter.state';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      DashboardState,
      ParameterState
    ]),
  ]
})
export class DashboardModule { }
