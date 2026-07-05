import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTagComponent } from './create-tag/create-tag.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';
import { TagsComponent } from './tags.component';

const routes: Routes = [
  {
    path: "",
    component: TagsComponent,
  },
  {
    path: "create",
    component: CreateTagComponent,
  },
  {
    path: "edit/:id",
    component: EditTagComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
