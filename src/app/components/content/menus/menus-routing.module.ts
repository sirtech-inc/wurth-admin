import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenusComponent} from "@components/content/menus/menus.component";
import {EditMenuComponent} from "@components/content/menus/edit-menu/edit-menu.component";

const routes: Routes = [
  {
    path : '',
    component : MenusComponent
  },
  {
    path: 'edit/:id',
    component: EditMenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
