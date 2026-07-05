import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DialogModule,
    OverlayPanelModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ChipModule,
    DividerModule,
    RadioButtonModule,
    SelectButtonModule
  ],
  exports:[
    DialogModule,
    OverlayPanelModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ChipModule,
    DividerModule,
    RadioButtonModule,
    SelectButtonModule
  ]
})
export class AppPrimeNgModule { }
