import {CategoryModel} from '@shared/interface';
import {GetCategories, GetParameters} from '@shared/action';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {Select, Store} from '@ngxs/store';

import {CategoryState} from 'src/app/shared/state/category.state';
import {ParameterState} from "@shared/state/parameter.state";
import {ParameterFormat} from "@shared/interface/parameter.interface";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit, OnDestroy {

    @Select(CategoryState.category) category$: Observable<CategoryModel>;
    @Select(ParameterState.parameters('ecommerce', 'letter')) ecommerce$: Observable<ParameterFormat[]>

    @Input() type: string = 'create';
    @Input() categoryType: string | null = 'product';

    private destroy$ = new Subject<void>();

    constructor() {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
