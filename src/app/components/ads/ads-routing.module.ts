import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAdsComponent } from './create-ads/create-ads.component';
import { EditAdsComponent } from './edit-ads/edit-ads.component';
import { AdsComponent } from './ads.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateAdsComponent
  },
  {
    path: 'edit/:id',
    component : EditAdsComponent
  },
  {
    path: '',
    component : AdsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdsRoutingModule { }
