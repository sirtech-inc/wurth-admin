import {Component, Input, OnChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Category} from '@shared/interface';
import {ParameterFormat} from "@shared/interface/parameter.interface";
import {SelectButtonChangeEvent} from "primeng/selectbutton";
import {Store} from "@ngxs/store";
import {GetCategoriesByEcommerce, SetEcommerce} from "@shared/action";

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnChanges {

    @Input() type: string;
    @Input() data: Category[];
    @Input() recursionKey: string;
    @Input() displayKey: string = 'name';
    @Input() categoryType: string | null = 'product';
    @Input() ecommerce: ParameterFormat[] = [];

    public treeSearch = new FormControl('');
    public dataToShow: Category[] = [];

    public selectedEcommerce: string

    constructor(
        private store:Store
    ) {

        this.treeSearch.valueChanges
            .subscribe(
                (data) => {
                    if (data) {
                        this.dataToShow = [];
                        this.data.forEach(item => {
                            this.hasValue(item) && this.dataToShow.push(item)
                        })
                    } else {
                        this.dataToShow = this.data;
                    }
                });


    }

    ngOnChanges() {
        this.dataToShow = this.data;
        if (!this.selectedEcommerce) {
            this.selectedEcommerce = this.ecommerce[0]?.value
        }
    }

    onChangeEcommerce({value}:SelectButtonChangeEvent) {
        if (value) {
            this.store.dispatch( new GetCategoriesByEcommerce(value))
            this.store.dispatch( new SetEcommerce(value) )
        }
    }

    hasValue(item: any) {
        let valueToReturn = false;
        if (item[this.displayKey].toLowerCase().includes(this.treeSearch?.value?.toLowerCase())) {
            valueToReturn = true;
        }
        item[this.recursionKey]?.length && item[this.recursionKey].forEach((child: Category) => {
            if (this.hasValue(child)) {
                valueToReturn = true;
            }
        })
        return valueToReturn;
    }


}
