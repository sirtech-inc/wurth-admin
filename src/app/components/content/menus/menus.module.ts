import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenusRoutingModule } from './menus-routing.module';
import {FormMenuComponent} from "@components/content/menus/form-menu/form-menu.component";
import {MenusComponent} from "@components/content/menus/menus.component";
import {EditMenuComponent} from "@components/content/menus/edit-menu/edit-menu.component";
import {TreeComponent} from "@components/content/menus/tree/tree.component";
import {TreeNodeComponent} from "@components/content/menus/tree/tree-node/tree-node.component";
import {SharedModule} from "@shared/shared.module";
import {NgxsModule} from "@ngxs/store";
import {ContentState} from "@shared/state/content.state";


@NgModule({
  declarations: [
      FormMenuComponent,
      MenusComponent,
      EditMenuComponent,
      TreeComponent,
      TreeNodeComponent
  ],
  imports: [
    CommonModule,
    MenusRoutingModule,
    SharedModule,
      NgxsModule.forFeature([
          ContentState
      ])
  ]
})
export class MenusModule { }
