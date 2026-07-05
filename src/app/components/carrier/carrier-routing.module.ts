import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrierComponent } from './carrier.component';
import { CreateCarrierComponent } from './create-carrier/create-carrier.component';
import { EditCarrierComponent } from './edit-carrier/edit-carrier.component';

const routes: Routes = [
  {
    path : 'create',
    component : CreateCarrierComponent,
  },
  {
    path: 'edit/:id',
    component : EditCarrierComponent
  },
  {
    path : '',
    component : CarrierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrierRoutingModule { }
