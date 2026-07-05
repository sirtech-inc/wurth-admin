import {Component, Input, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {LoaderState} from '../../../state/loader.state';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

    // @Input() class: string = 'btn btn-theme btn-sm ms-auto mt-2';
    @Input() class: string = 'btn btn-theme ms-auto';
    @Input() classExtra: string;
    @Input() disabled: boolean = false;
    @Input() icon: 'add' | 'edit' | 'delete' | 'upload' | 'process' | 'save' | 'search'
    @Input() iconClass: string | null;
    @Input() id: string;
    @Input() label: string = 'Submit';
    @Input() size: 'sm' | 'md' | 'lg' = 'md'
    @Input() spinner: boolean = true;
    @Input() spinnerManually: boolean = false;
    @Input() type: string = 'submit';

    public buttonId: string | null;

    @Select(LoaderState.buttonSpinner) public spinnerStatus$: Observable<boolean>;

    constructor() {
        this.spinnerStatus$.subscribe(res => {
            if (res == false) {
                this.buttonId = null;
            }
        });
    }

    ngOnInit(): void {
        this.class = this.class + ' ' + `btn-${this.size}`;
    }

    public onClick(id: string): void {
        this.buttonId = id;
    }

}
