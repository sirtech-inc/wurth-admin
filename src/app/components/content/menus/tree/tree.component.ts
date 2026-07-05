import { Component, Input } from '@angular/core';

import { ContentMenu } from '@shared/interface/content.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent {
  @Input() data: ContentMenu[];
  @Input() recursionKey: string;
  @Input() displayKey: string = 'name';
  public treeSearch = new FormControl('');
  public dataToShow: ContentMenu[] = [];

  
  constructor(){
    this.treeSearch.valueChanges
        .subscribe(
          (data) => {
        if(data) {
            this.dataToShow = [];
            this.data.forEach(item =>{
                this.hasValue(item) && this.dataToShow.push(item)
            })
        } else {
            this.dataToShow = this.data;
        }
    });
  }

  ngOnChanges() {
    this.dataToShow = this.data;
  }

  hasValue(item: any) {
    let valueToReturn = false;
    if(item[this.displayKey].toLowerCase().includes(this.treeSearch?.value?.toLowerCase())){
      valueToReturn = true;
    }
    item[this.recursionKey]?.length && item[this.recursionKey].forEach((child: ContentMenu) => {
      if(this.hasValue(child)) {
        valueToReturn = true;
      }
    })
    return valueToReturn;
  }

}
