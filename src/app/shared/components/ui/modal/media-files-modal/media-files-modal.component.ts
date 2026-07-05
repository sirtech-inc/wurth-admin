import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { FileState } from '@shared/state/file-image.state';
import { Images } from '@shared/interface';
import { ListImages } from '@shared/action/file-image.action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-media-files-modal',
  templateUrl: './media-files-modal.component.html',
  styles: ``
})
export class MediaFilesModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() module: string;
  @Output() onSelect: EventEmitter<Images> = new EventEmitter();
  @Output() opened : EventEmitter<boolean> = new EventEmitter();
  // @Select(FileState.getImages) images$: Observable<Images[]>;
  @ViewChild("mediaFilesModal", { static: true }) mediaFilesModal: TemplateRef<any>;
  private modalService = inject(NgbModal);
  public modalOpen: boolean = false;
  public search: string = '';

  public listFiltered$: Observable<Images[]>;
  public listOriginal$: Observable<Images[]>;



  constructor(private store: Store) { }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.store.dispatch(new ListImages(this.module));
    this.listOriginal$ = this.store.select(FileState.getImages);
    this.listFiltered$ = this.listOriginal$;
  }

  openModal() {
    this.modalOpen = true;
		this.modalService.open(this.mediaFilesModal,{
      ariaLabelledBy: 'Alert-Modal',
      size: 'lg',
      centered: false,
      windowClass: 'theme-modal text-center'
    
    }).result.then(
      (result) => {},
      (reason) => {
        this.modalOpen = false;
        this.opened.emit(false);
      }
    )
	}

  onSelectFile(file: Images) {
    this.modalService.dismissAll();
    this.onSelect.emit(file);
  }


  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

  onSearch(){
    this.listFiltered$ = this.listOriginal$.pipe(
      map((list: Images[]) => {
        return list.filter((item: Images) => {
          return item.name.toLowerCase().includes(this.search.toLowerCase());
        })
      })
    )
  }


}
