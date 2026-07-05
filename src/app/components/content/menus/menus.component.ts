import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GetContentMenu, GetContentPageSelect, SetEcommerceMenu } from '@shared/action/content.action';
import { Observable, Subject, takeUntil } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { Select2DataFormat, SimpleFormat } from '@shared/interface';

import { ContentMenuModel } from "@shared/interface/content.interface";
import { ContentState } from "@shared/state/content.state";
import { GetParameters } from '@shared/action';
import { ParameterState } from '@shared/state/parameter.state';
import { Router } from '@angular/router';
import { typeForm } from '@shared/types/general.types';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent implements OnInit, OnDestroy {
  @Input() type: typeForm = 'create';
  @Select(ContentState.menu) contentMenu$: Observable<ContentMenuModel>;
  ecommerces: Select2DataFormat<SimpleFormat>[]
  @Select(ContentState.selectedEcommerce) selectedEcommerce$: Observable<string>;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.store.dispatch(new GetParameters({ key: "ecommerce" })).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        const ecommerces = this.store.selectSnapshot(ParameterState.parametersSelect2("ecommerce"));
        this.ecommerces = ecommerces;
      }
    })
  }

  updateEcommerce(event: any) {
    const key = event?.other?.value
    if (key) {
      this.store.dispatch(new SetEcommerceMenu(key));
      this.store.dispatch(new GetContentMenu(key))
      this.store.dispatch( new GetContentPageSelect(key) )
      this.router.navigate(['/menus'])
    }
  }


  checkSelectedEcommerce(event: any) {
    const key = event?.other?.value
    if (key) {
      return this.store.selectSnapshot(ContentState.selectedEcommerce) === key;
    }
    return false
  }


}
