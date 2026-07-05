import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input } from '@angular/core';

import { Store } from '@ngxs/store';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrl: './tree-node.component.scss'
})
export class TreeNodeComponent {
  @Input() node: any;
  @Input() recursionKey: string;
  @Input() displayKey: string;

  public showChildrenNode: boolean = true;
  public id: number;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  

}
