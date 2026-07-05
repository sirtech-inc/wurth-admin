import { CategoryState } from 'src/app/shared/state/category.state';
import { CommonModule } from '@angular/common';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FileState } from '@shared/state/file-image.state';
import { FormProductComponent } from './form-product/form-product.component';
import { NgModule } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { NgxsModule } from '@ngxs/store';
import { ParameterState } from '@shared/state/parameter.state';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductState } from '../../shared/state/product.state';
import { SettingState } from 'src/app/shared/state/setting.state';
import { SharedModule } from '../../shared/shared.module';
import { TagState } from '@shared/state/tag.state';

@NgModule({
  declarations: [
    ProductComponent,
    CreateProductComponent,
    EditProductComponent,
    FormProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    NgxEditorModule,
    NgxsModule.forFeature([
      ProductState,
      CategoryState,
      SettingState,
      ParameterState,
      TagState,
      FileState
    ])
  ]
})
export class ProductModule { }
