import { Params, Router, ActivatedRoute } from "@angular/router";
import {
  Product,
  ProductModel,
} from "src/app/shared/interface/product.interface";
import { Select, Store } from "@ngxs/store";
import {
  TableClickedAction,
  TableConfig
} from "src/app/shared/interface/table.interface";
import { AdvanceDropDownFormat } from '@shared/interface';

import { Component } from "@angular/core";
import { GetProducts } from "src/app/shared/action/product.action";
import { Observable } from "rxjs";
import { ProductState } from "src/app/shared/state/product.state";
import { ParameterState } from '@shared/state/parameter.state';

import { ParameterService } from '@shared/services/parameter.service';
import { GetParameters } from '@shared/action/parameter.action';


@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent {
  @Select(ProductState.product) products$: Observable<ProductModel>;
  @Select(ParameterState.parametersAdvanceDropDown('ecommerce')) ecommerce$: Observable<AdvanceDropDownFormat<string>[]>

  filters = {
    code: '',
    name: ''
  };

  selectedEcommerce: number[] = [];
  ecommerce: string[];
  selectedEcommerceText: any[] = [];

  public tableConfig: TableConfig = {
    columns: [
      {
        title: "products_table_code",
        dataField: "code",
        sortable: true,
        sort_direction: "desc",
        colSmall: true,
      },
      {
        title: "products_table_reference",
        dataField: "reference",
        alignment: "left",
      },
      {
        title: "products_table_name",
        dataField: "name",
        sortable: true,
        alignment: "left",
      },
      {
        title: "products_table_ecommerce",
        dataField: "ecommerce",
        alignment: "left",
      },
      { title: "products_table_packaging", dataField: "packaging" },
      {
        title: "products_table_createAt",
        dataField: "date_create",
        sortable: true,
        sort_direction: "desc",
      },
      {
        title: "global_status",
        dataField: "status",
        sortable: true,
        translate: true,
        colSmall: true,
      },
    ],
    rowActions: [
      {
        label: "Edit",
        actionToPerform: "edit",
        icon: "ri-pencil-line",
        permission: "product.edit",
      },
    ],
    data: [] as Product[],
    total: 0,
  };

  constructor(private store: Store,
    private router: Router,
    private parameterService: ParameterService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.initServices()
    this.products$.subscribe((data) => {
      this.tableConfig.data = data.datos;
      this.tableConfig.total = data.total;
    });
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == "edit") this.edit(action.data);
  }

  private edit(data: Product) {
    this.router.navigateByUrl(`/products/edit/${data.code}`);
  }

  onTableChange(data?: Params) {
    const params = {
      ...data,
      code: this.filters.code || '',
      name: this.filters.name || '',
      list_ecommerce: this.selectedEcommerceText.length
        ? this.selectedEcommerceText.join(',')
        : ''
    };
    this.store.dispatch(new GetProducts(params));
  }

  applyFilters() {
    this.onTableChange({ page: 1 });
  }

  onSelectEcommerceItem(data: number[]) {
    this.selectedEcommerce = data ?? [];
    this.selectedEcommerceText = this.parameterService.getOtherByValue(data, 'ecommerce');

    /*if (selected && Array.isArray(selected)) {
      this.selectedEcommerce = selected.map(e => e); // guarda los textos
    } else {
      this.selectedEcommerce = [];
    }*/
    /*const selected = this.parameterService.getOtherByValue(data, 'ecommerce') //.getOtherById(data)
    if (selected && Array.isArray(selected) && selected.length > 0) {
      this.form.controls['ecommerce'].setValue(selected);
    } else {
      this.form.controls['ecommerce'].setValue(null);
    }*/
  }


  private initServices() {
    const ecommerce$ = this.store.dispatch(new GetParameters({ key: 'ecommerce' }));

    //this.selectedEcommerce = this.parameterService.getValueByOther(this.ecommerce, 'ecommerce')
  }

}
