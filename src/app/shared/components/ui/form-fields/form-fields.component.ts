import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss']
})
export class FormFieldsComponent implements AfterViewInit {
  @ViewChild('labelElement', { static: false }) labelElement: ElementRef;
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;




  @Input() inline: 'horizontal' | 'vertical' = 'horizontal';

  @Input() class: string = "mb-3 row g-2";
  @Input() label: string;
  @Input() labelChild: string;
  @Input() labelExtraChild: string;
  @Input() labelClass: string = "form-label-title";
  @Input() belowText: string;
  //@Input() labelClass: string = "form-label-title mb-0";

  @Input() gridClass = '';
  @Input() for: string;
  @Input() required: boolean;

  @Input() labelWidth: number = 2;

  @Input() labelCentered : boolean = true


  // public _labelWidth: string;
  // public _inputWidth: string;

  constructor() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      this.class = this.labelCentered ? `${this.class} align-items-center` : `${this.class} align-items-top pt-10`

      const label = this.labelElement.nativeElement
      const input = this.inputElement.nativeElement
  
      if (this.inline === 'horizontal') label.classList.add(`col-sm-${this.labelWidth}`)
      if (this.inline === 'vertical') label.classList.add('col-sm-12')
      
      if(this.inline === 'horizontal') input.classList.add( `col-sm-${12- this.labelWidth}` )
      if (this.inline === 'vertical') input.classList.add('col-sm-12')

    })
  }

  // @Input() labelClass: string = "form-label-title col-sm-2 mb-0";
  // @Input() gridClass: string = "col-sm-10";

}
