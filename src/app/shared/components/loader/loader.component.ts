import { Component, Input } from '@angular/core';

import { LoaderState } from '@shared/state/index.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  @Input() loaderClass: string = 'loader-wrapper';
  // @Select(LoaderState.status) public loadingStatus$: Observable<boolean>;

}
