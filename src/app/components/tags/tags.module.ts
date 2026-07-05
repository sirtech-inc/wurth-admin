import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { CreateTagComponent } from './create-tag/create-tag.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';
import { FormTagComponent } from './form-tag/form-tag.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { TagState } from 'src/app/shared/state/tag.state';


@NgModule({
  declarations: [
    TagsComponent,
    CreateTagComponent,
    EditTagComponent,
    FormTagComponent
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,SharedModule,
    NgxsModule.forFeature([TagState])
  ],
  exports : [
    TagsComponent,
    CreateTagComponent,
    EditTagComponent,
  ]
})
export class TagsModule { }
