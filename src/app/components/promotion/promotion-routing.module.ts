import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionComponent } from './promotion.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { EditPromotionComponent } from './edit-promotion/edit-promotion.component';

const routes: Routes = [
  { path: '', component: PromotionComponent },
  { path: 'create', component: CreatePromotionComponent },
  { path: 'edit/:id', component: EditPromotionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
