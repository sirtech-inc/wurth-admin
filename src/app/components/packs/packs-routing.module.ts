import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePacksComponent } from './create-packs/create-packs.component';
import { EditPacksComponent } from './edit-packs/edit-packs.component';
import { PacksComponent } from './packs.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreatePacksComponent
  },
  {
    path: 'edit/:id',
    component : EditPacksComponent
  },
  {
    path: '',
    component : PacksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacksRoutingModule { }
