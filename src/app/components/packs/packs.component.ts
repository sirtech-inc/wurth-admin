import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pack, PackModel } from 'src/app/shared/interface/pack.interface';
import { Params, TableClickedAction, TableConfig } from 'src/app/shared/interface';
import { Select, Store } from '@ngxs/store';

import { GetPacks } from '@shared/action/pack.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PackState } from '@shared/state/pack.state';
import { PackService } from '@shared/services/pack.service';
import { NotificationService } from '@shared/services/index.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styles: ``
})
export class PacksComponent implements OnInit, OnDestroy {
  @Select(PackState.pack) packs$: Observable<PackModel>;

  private destroy$ = new Subject<void>();
  private currentParams: Params = {};

  public tableConfig: TableConfig = {
    columns: [
      { title: "packs_table_code", dataField: "code", sortable: true, sort_direction: 'desc', colSmall: true },
      { title: "packs_table_ecommerce", dataField: "ecommerce", upper: true, alignment: 'left' },
      { title: "packs_table_name", dataField: "name", sortable: true, alignment: 'left' },
      { title: "packs_table_amount", dataField: "amount", alignment: 'left' },
      { title: "packs_table_stock", dataField: "stock", alignment: 'left' },
      { title: "packs_table_status", dataField: "status", translate: true, alignment: 'left' },
      { title: "packs_table_created_at", dataField: "date_create", sortable: true, alignment: 'left' },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit" },
      { label: "global_delete", actionToPerform: "delete", icon: "ri-delete-bin-line" }
    ],
    data: [] as Pack[],
    total: 0
  };

  constructor(
    private store: Store,
    private router: Router,
    private packService: PackService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.packs$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data);
    if (action.actionToPerform == 'delete') this.onDelete(action.data);
  }

  private edit(data: Pack) {
    this.router.navigateByUrl(`/packs/edit/${data.code}`);
  }

  private onDelete(data: Pack) {
    if (!data?.code) return;

    this.packService.deletePack(data.code).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notificationService.showSuccess('Pack eliminado correctamente');
        this.store.dispatch(new GetPacks(this.currentParams));
      },
      error: (error) => {
        //  El API responde 409 con el motivo en result.detail cuando el pack está en pedidos o
        //  carritos. Se muestra ese texto: antes se caía al genérico y el usuario no sabía por qué.
        const message = error?.error?.result?.detail
          || error?.error?.message
          || 'No se pudo eliminar el pack';
        this.notificationService.showError(message, 'Aviso');
      }
    });
  }

  onTableChange(data?: Params) {
    this.currentParams = data || {};
    this.store.dispatch(new GetPacks(data));
  }


}
