import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective {

  constructor(private el: ElementRef) {}

  @Input() allowDecimal: boolean = false;

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    let newValue = initialValue.replace(/[^0-9.]/g, '');

    if (this.allowDecimal) {
      const decimalCheck = newValue.split('.');
      if (decimalCheck[1]) {
        decimalCheck[1] = decimalCheck[1].slice(0, 2);
        newValue = decimalCheck[0] + '.' + decimalCheck[1];
      }
    } else {
      newValue = newValue.replace(/[.]/g, '');
    }

    if (initialValue !== newValue) {
      this.el.nativeElement.value = newValue;
      event.preventDefault();
    }
  }

}