import {Component, OnInit} from '@angular/core';
import {Params, TableClickedAction, TableConfig} from 'src/app/shared/interface';
import {Carrier, CarrierModel} from '../../shared/interface/carrier.interface';
import {Pack} from "@shared/interface/pack.interface";
import {GetPacks} from "@shared/action/pack.action";
import {Select, Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {CarrierState} from "@shared/state/carrier.state";
import {Observable} from "rxjs";
import {GetCarriers} from "@shared/action/carrier.action";

@Component({
    selector: 'app-carrier',
    templateUrl: './carrier.component.html',
    styleUrl: './carrier.component.scss'
})
export class CarrierComponent implements OnInit {

    @Select(CarrierState.carrier) carrier$: Observable<CarrierModel>;
    private currentParams: Params = {};
    private readonly defaultPaginate = 10;
    public filters = {
        name: ''
    };

    public tableConfig: TableConfig = {
        columns: [
            {title: "carriers_table_code", dataField: "code", colSmall: true, sortable: true, sort_direction: 'desc'},
            {title: "carriers_table_name", dataField: "name", sortable: true},
            {title: "carriers_table_description", dataField: "description",},
            {title: "carriers_table_status", dataField: "status", sortable: true, translate: true},
            {title: "carriers_table_created_at", dataField: "date_create", sortable: true},

        ],
        rowActions: [
            {label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line"},
        ],
        data: [] as Carrier[],
        total: 0
    };

    constructor(
        private store: Store,
        private router: Router
    ) {
    }


    onActionClicked(action: TableClickedAction) {
        if (action.actionToPerform == 'edit') this.edit(action.data)
    }

    private edit(data: Pack) {
        this.router.navigateByUrl(`/carriers/edit/${data.code}`);
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
            filter_name: this.filters.name || ''
        };
        this.store.dispatch(new GetCarriers(params));
    }

    applyFilters() {
        this.onTableChange({ ...this.currentParams, page: 1 });
    }

    clearFilters() {
        this.filters.name = '';
        this.onTableChange({ page: 1 });
    }

    ngOnInit(): void {
        this.carrier$.subscribe((data) => {
            this.tableConfig.data = data.datos;
            this.tableConfig.total = data.total;
        })
    }

}
