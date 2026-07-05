import { Component, Input, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-a-button',
  templateUrl: './a-button.component.html',
  styleUrl: './a-button.component.scss'
})
export class AButtonComponent implements OnInit{

  @Input() text: string;
  @Input() icon: 'add' | 'edit' | 'delete' | 'upload' ;
  @Input() link: string;
  @Input() size : 'sm' | 'md' | 'lg' = 'md';
  @Input() extraClass: string


  ngOnInit(): void {
     this.extraClass =  `${this.extraClass} btn-${this.size}`
  }

}
