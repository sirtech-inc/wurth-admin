import { Ads, AdsModel } from 'src/app/shared/interface/ads.interface';
import { Component, OnInit } from '@angular/core';
import { AdvanceDropDownFormat } from '@shared/interface';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Params, TableClickedAction, TableConfig } from 'src/app/shared/interface';
import { Select, Store } from '@ngxs/store';

import { AdsState } from '@shared/state/ads.state';
import { GetAds } from '@shared/action/ads.action';
import { Router } from '@angular/router';
import { AdsService } from '@shared/services/ads.service';
import { NotificationService } from '@shared/services/index.service';
import { GetParameters } from '@shared/action/parameter.action';
import { ParameterState } from '@shared/state/parameter.state';
import { ParameterService } from '@shared/services/parameter.service';
import { Select2Data } from 'ng-select2-component';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent implements OnInit {

  private destroy$ = new Subject<void>();

  // @Select(ProductState.product) products$ : Observable<ProductModel>;
  @Select(AdsState.ads) ads$ : Observable<AdsModel>;
  @Select(ParameterState.parametersAdvanceDropDown('ecommerce')) ecommerce$: Observable<AdvanceDropDownFormat<string>[]>;

  constructor(
    private store: Store,
    private router: Router,
    private adsService: AdsService,
    private notificationService: NotificationService,
    private parameterService: ParameterService
  ) { }

  private currentParams: Params = {};
  private readonly defaultPaginate = 10;
  public selectedEcommerce: number[] = [];
  public selectedEcommerceText: string[] = [];
  public filters = {
    name: '',
    type: ''
  };
  public readonly adsType: Select2Data = [
    { value: 'slider', label: 'SLIDER' },
    { value: 'banner', label: 'BANNER' },
  ];

  public tableConfig: TableConfig = {
    columns: [
      { title: "ads_table_code", dataField: "no", type: "no", sortable: true, colSmall: true, alignment: 'right' },
      { title: "ads_table_name", dataField: "name", sortable: true, alignment: 'left' },
      { title: "ads_table_type", dataField: "type", alignment: 'left' },
      { title: "ads_table_design", dataField: "design", alignment: 'left' },
      { title: "packs_table_ecommerce", dataField: "ecommerce", upper: true, alignment: 'left' },
      { title: "ads_table_status", dataField: "status", sortable: true, translate: true, alignment: 'left' },
      { title: "ads_table_created_at", dataField: "date_create", sort_direction: 'desc', alignment: 'left' }
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "product.destroy" }
    ],
    data: [] as Ads[],
    total: 0
  };

  ngOnInit(): void {
    this.store.dispatch(new GetParameters({ key: 'ecommerce' }));
    this.ads$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    })
  }

  onTableChange(data?: Params) {
    const incomingParams = data || {};
    this.currentParams = {
      ...this.currentParams,
      ...incomingParams,
      paginate: Number(incomingParams?.['paginate'] || this.currentParams?.['paginate'] || this.defaultPaginate),
      page: Number(incomingParams?.['page'] || this.currentParams?.['page'] || 1)
    };

    const params: Params = {
      ...this.currentParams,
      filter_name: this.filters.name || '',
      filter_type: this.filters.type || '',
      filter_ecommerce: this.selectedEcommerceText.length
        ? this.selectedEcommerceText.join(',')
        : ''
    };
    this.store.dispatch(new GetAds(params));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.onEdit(action.data)
    if (action.actionToPerform == 'delete') this.onDelete(action.data)
  }

  private onEdit(data:Ads){
    this.router.navigateByUrl(`/ads/edit/${data.code}`);
  }

  private onDelete(data: Ads) {
    if (!data?.code) return;

    this.adsService.deleteBanner(data.code).subscribe({
      next: () => {
        this.notificationService.showSuccess('Elemento visual eliminado correctamente');
        this.store.dispatch(new GetAds(this.currentParams));
      },
      error: (error) => {
        const message = error?.error?.message || 'No se pudo eliminar el elemento visual';
        this.notificationService.showError(message, 'Aviso');
      }
    });
  }

  applyFilters() {
    this.onTableChange({ ...this.currentParams, page: 1 });
  }

  clearFilters() {
    this.filters = {
      name: '',
      type: ''
    };
    this.selectedEcommerce = [];
    this.selectedEcommerceText = [];
    this.onTableChange({ page: 1 });
  }

  onSelectEcommerceItem(data: number[]) {
    this.selectedEcommerce = data ?? [];
    this.selectedEcommerceText = this.parameterService.getOtherByValue(
      this.selectedEcommerce,
      'ecommerce'
    ) || [];
  }

}
