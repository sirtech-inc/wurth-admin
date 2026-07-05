import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { TableClickedAction, TableConfig } from 'src/app/shared/interface/table.interface';
import { Tag, TagModel } from 'src/app/shared/interface/tag.interface';

import { GetTags } from 'src/app/shared/action/tag.action';
import { Observable } from 'rxjs';
import { TagState } from 'src/app/shared/state/tag.state';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent implements OnInit, OnDestroy {

  @Select(TagState.tag) tag$: Observable<TagModel>;


  public tableConfig: TableConfig = {
    columns: [
      { title: "tags_table_code", dataField: "code", type: "no" },
      { title: "tags_table_name", dataField: "name", sort_direction: 'desc', alignment : 'left' },
      { title: "tags_table_description", dataField: "description", sort_direction: 'desc' },
      { title: "tags_table_created", dataField: "date_created", alignment: 'left', translate: true },
      { title: "tags_table_status", dataField: "status", alignment: 'left', translate : true,  sort_direction: 'desc' }
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "tag.edit" },
    ],
    data: [] as Tag[],
    total: 0
  };


  constructor(
    private store: Store,
    public router: Router
  ) { }


  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.tag$.subscribe(tag => {
      this.tableConfig.data = tag ? tag?.datos : [];
      this.tableConfig.total = tag ? tag?.total : 0;
    });
  }


  onTableChange(data?: any) {
    this.store.dispatch(new GetTags(data));
  }

  onActionClicked(action: TableClickedAction) {
    if (action.actionToPerform == 'edit') this.edit(action.data)
  }

  private edit(data: Tag) {
    this.router.navigateByUrl(`/tags/edit/${data.code}`);
  }


}
