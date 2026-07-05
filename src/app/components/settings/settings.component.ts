import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ParameterState} from "@shared/state/parameter.state";
import {Select, Store} from "@ngxs/store";
import {
    ClearSetting,
    GetCategories,
    GetCategoriesForSetting,
    GetParameters, GetProductsToSelect, GetSettingContents, GetSettingLinks,
    GetSettingOptionByEcommerce, GetSettingPolicies,
    GetSocialNetworks
} from "@shared/action";
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {ParameterFormat} from "@shared/interface/parameter.interface";
import {SelectButtonChangeEvent} from 'primeng/selectbutton';
import {ParameterService} from '@shared/services/parameter.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {

    @Select(ParameterState.parameters('ecommerce', 'letter')) ecommerce$: Observable<ParameterFormat[]>;
    private destroy$ = new Subject<void>();
    public selectedEcommerce: string = 'wmax';

    constructor(
        private store: Store,
    ) {}


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnInit(): void {
        forkJoin([
            this.store.dispatch(new GetParameters({key: 'ecommerce'})),
            this.store.dispatch(new GetParameters({key: 'backoffice_mode'})),
            this.store.dispatch(new GetCategories()),
            this.store.dispatch(new GetProductsToSelect(this.selectedEcommerce)),
            this.store.dispatch(new ClearSetting())]).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: () => {
                const ecommerce = this.store.selectSnapshot(ParameterState.parameters('ecommerce', 'letter'))
                if (!this.selectedEcommerce) {
                    this.selectedEcommerce = ecommerce[0]?.value || 'wmax'
                }
                if (ecommerce?.length > 0) {
                    this.store.dispatch(new GetSettingOptionByEcommerce(ecommerce[0].value))
                    this.store.dispatch(new GetSocialNetworks(ecommerce[0].value))
                    this.store.dispatch(new GetCategoriesForSetting(ecommerce[0].value))
                    this.store.dispatch(new GetSettingLinks())
                    this.store.dispatch(new GetSettingContents(ecommerce[0].value))
                    this.store.dispatch(new GetSettingPolicies())
                }
            }
        })
    }

    onChangeEcommerce({value}: SelectButtonChangeEvent) {
        if (!value) return
        this.selectedEcommerce = value
        this.store.dispatch(new GetProductsToSelect(value))
        this.store.dispatch(new GetSettingOptionByEcommerce(value))
        this.store.dispatch(new GetSocialNetworks(value))
        this.store.dispatch(new GetCategoriesForSetting(value))
        this.store.dispatch(new GetSettingLinks())
        this.store.dispatch(new GetSettingContents(value))
        this.store.dispatch(new GetSettingPolicies())
    }

}


