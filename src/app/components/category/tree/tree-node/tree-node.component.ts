import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, ViewChild } from '@angular/core';

import { Category } from '../../../../shared/interface/category.interface';
import { DeleteModalComponent } from "../../../../shared/components/ui/modal/delete-modal/delete-modal.component";
import { Store } from '@ngxs/store';

// import { DeleteCategory } from '../../../../shared/action/category.action';


@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {

  @Input() node: any;
  @Input() recursionKey: string;
  @Input() displayKey: string;
  @Input() categoryType: string | null = 'product';

  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  public showChildrenNode: boolean = true;
  public id: number;

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(){
    this.route.params.subscribe( params => this.id = params['id']);
  }

  // delete(actionType: string, data: Category) {
  //     this.store.dispatch(new DeleteCategory(data.id!, data.type)).subscribe({
  //       complete: () => {
  //         if(data.type == 'post')
  //           this.router.navigateByUrl('/blog/category');
  //         else
  //           this.router.navigateByUrl('/category');
  //       }
  //     });
  // }

}
