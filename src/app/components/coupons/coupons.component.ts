import { Component, OnDestroy, OnInit } from '@angular/core';
import { Coupon, CouponModel } from 'src/app/shared/interface/coupon.interface';
import { Params, TableClickedAction, TableConfig } from 'src/app/shared/interface';
import { Select, Store } from '@ngxs/store';

import { CouponState } from '@shared/state/coupon.state';
import { GetCoupon } from '@shared/action/coupons.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent implements OnInit, OnDestroy {

  @Select(CouponState.coupon) coupons$: Observable<CouponModel>;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.coupons$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public tableConfig: TableConfig = {
    columns: [
      { title: "coupons_table_code", dataField: "code", sortable: true, sort_direction: 'desc', colSmall: true },
      { title: "coupons_table_name", dataField: "name", sortable: true },
      { title: "coupons_table_ecommerce", dataField: "ecommerce", upper: true},
      { title: "coupons_table_reference", dataField: "reference" },
      { title: "coupons_table_availability_start", dataField: "availability_start" },
      { title: "coupons_table_availability_end", dataField: "availability_end" },
      { title: "coupons_table_status", dataField: "status" , sortable: true, translate: true, upper: true},
      { title: "coupons_created_at", dataField: "date_create", sortable: true },

    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit" }
    ],
    data: [] as Coupon[],
    total: 0
  };


  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data)
  }

  private edit(data: Coupon) {
    this.router.navigateByUrl(`/coupons/edit/${data.code}`);
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetCoupon(data));
  }



}
