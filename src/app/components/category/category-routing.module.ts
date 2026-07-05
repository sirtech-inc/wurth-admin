import { RouterModule, Routes } from '@angular/router';

import { CategoryComponent } from './category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { NgModule } from '@angular/core';

// import { PermissionGuard } from 'src/app/core/guard/permission.guard';



const routes: Routes = [
  {
    path: "",
    component : CategoryComponent,
    // data : {
    //   permission: 'category.index' 
    // }    
  },
  {
    path: "edit/:id",
    component: EditCategoryComponent,
    // canActivate: [PermissionGuard],
    // data: { 
    //   permission: ['category.index', 'category.edit'] 
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
