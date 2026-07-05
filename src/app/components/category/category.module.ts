import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryState } from '../../shared/state/category.state';
import { CommonModule } from '@angular/common';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { FileState } from '@shared/state/file-image.state';
import { FormCategoryComponent } from './form-category/form-category.component';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ParameterState } from '@shared/state/parameter.state';
import { SharedModule } from 'src/app/shared/shared.module';
import { TreeComponent } from './tree/tree.component';
import { TreeNodeComponent } from './tree/tree-node/tree-node.component';

// States

@NgModule({
  declarations: [
    CategoryComponent,
    TreeComponent,
    FormCategoryComponent,
    TreeNodeComponent,
    EditCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      CategoryState,
      ParameterState,
      FileState
    ])
  ],
  exports: [
    CategoryComponent,
    EditCategoryComponent
  ]
})
export class CategoryModule { }
