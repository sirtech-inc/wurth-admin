import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Params, Promotion, PromotionModel, TableClickedAction, TableConfig } from '@shared/interface';
import { Select, Store } from '@ngxs/store';

import { GetPromotion } from '@shared/action';
import { NotificationService } from '@shared/services/notification.service';
import { PromotionService } from '@shared/services/promotion.service';
import { PromotionState } from '@shared/state/promotion.state';
import { Router } from '@angular/router';
import { UploadPromotionComponent } from './upload-promotion/upload-promotion.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styles: ``
})
export class PromotionComponent implements OnInit, OnDestroy {

  @Select(PromotionState.promotion) promotion$: Observable<PromotionModel>;
  @ViewChild("uploadPromotionModal") UploadPromotionModal: UploadPromotionComponent;
  openModal: boolean = false;
  private destroy$ = new Subject<void>();

  public tableConfig: TableConfig = {
    columns: [
      { title: "promotions_list_code", dataField: "code", sortable: true, sort_direction: 'desc' },
      { title: "promotions_list_reference", dataField: "reference", sortable: true },
      { title: "promotions_list_ecommerce", dataField: "ecommerce", upper: true },
      { title: "promotions_list_availability_start", dataField: "availability_start" },
      { title: "promotions_list_availability_end", dataField: "availability_end" },
      { title: "promotions_list_status", dataField: "status", translate: true },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit" },
      { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" }
    ],
    data: [] as Promotion[],
    total: 0
  };

  private currentParams: Params = {};

  constructor(
    private store: Store,
    private router: Router,
    private promotionService: PromotionService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.promotion$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTableChange(data?: Params) {
    this.currentParams = data || {};
    this.store.dispatch(new GetPromotion(data));
  }
  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data)
    if (action.actionToPerform == 'delete') this.onDelete(action.data)
  }
  private edit(data: Promotion) {
    this.router.navigateByUrl(`/promotions/edit/${data.code}`);
  }

  private onDelete(data: Promotion) {
    if (!data?.code) return;

    this.promotionService.deletePromotion(data.code).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notificationService.showSuccess('Promoción eliminada correctamente');
        this.store.dispatch(new GetPromotion(this.currentParams));
      },
      error: (error) => {
        const message = error?.error?.message || 'No se pudo eliminar la promoción';
        this.notificationService.showError(message, 'Aviso');
      }
    });
  }

  onOpenModal() {
    this.openModal = true;
    setTimeout(() => { this.UploadPromotionModal.openModal() }, 100)
  }
}
