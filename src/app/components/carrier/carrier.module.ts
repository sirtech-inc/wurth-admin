import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CarrierRoutingModule} from './carrier-routing.module';
import {FormCarrierComponent} from './form-carrier/form-carrier.component';
import {CreateCarrierComponent} from './create-carrier/create-carrier.component';
import {EditCarrierComponent} from './edit-carrier/edit-carrier.component';
import {CarrierComponent} from './carrier.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {NgxsModule} from "@ngxs/store";
import {CarrierState} from "@shared/state/carrier.state";
import {FileState} from "@shared/state/file-image.state";


@NgModule({
    declarations: [
        CarrierComponent,
        FormCarrierComponent,
        CreateCarrierComponent,
        EditCarrierComponent
    ],
    imports: [
        CommonModule,
        CarrierRoutingModule,
        SharedModule,
        NgxsModule.forFeature([
            CarrierState,
            FileState
        ])
    ]
})
export class CarrierModule {
}
