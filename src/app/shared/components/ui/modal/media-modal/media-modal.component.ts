import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef, NgbNav } from '@ng-bootstrap/ng-bootstrap';

import { Attachment } from '../../../../interface/attachment.interface';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { Store } from '@ngxs/store';

// import { CreateAttachment } from '../../../../action/attachment.action';



@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
  styleUrls: ['./media-modal.component.scss']
})
export class MediaModalComponent {

  public active = 'upload';
  public closeResult: string;
  public modalOpen: boolean = false;

  public media: Attachment;
  public files: File[] = [];

  // @Input() multipleImage: boolean = false;
  @Input() multipleSelected: boolean = false;
  @Input() maxFileUpload: number = 1;
  @Input() url: boolean = false;

  @ViewChild("mediaModal", { static: false }) MediaModal: TemplateRef<string>;

  // @Output() selectImage: EventEmitter<Attachment> = new EventEmitter();
  // @Output() selectImages: EventEmitter<Attachment[]> = new EventEmitter();

  @Output() uploadImages: EventEmitter<Attachment[]> = new EventEmitter();

  constructor(private store: Store,
    private notificationService: NotificationService,
    private modalService: NgbModal) {
  }

  async openModal() {
    this.modalOpen = true;
    this.modalService.open(this.MediaModal, {
      ariaLabelledBy: 'Media-Modal',
      centered: true,
      windowClass: 'theme-modal modal-xl media-modal'
    }).result.then((result) => {
      `Result ${result}`
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    this.active = 'upload';
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    if ( this.maxFileUpload >= this.files.length){
      if ((this.files.length + event.addedFiles.length) <= this.maxFileUpload) {
        this.files.push(...event.addedFiles);
      } else this.notificationService.showError(`You've reached ${this.maxFileUpload} file maximum.`);
    }

      // if ((this.files.length + event.addedFiles.length) <= 5) {
        // this.files.push(...event.addedFiles);
      // } else this.notificationService.showError(`You've reached 5 file maximum.`);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadMedia() {
    if (this.files.length) {
      this.uploadImages.emit(
        this.files.map(file => {
          return {
            code: 0,
            description: file.name,
            name: file.name,
            file_name: file.name,
            mime_type: file.type,
            original_url: URL.createObjectURL(file),
            extension: file.name.split('.').pop(),
            size: file.size
          }
        })
      );
      this.modalService.dismissAll();
      // this.store.dispatch(new CreateAttachment(this.files)).subscribe({
      //   complete: () => {
      //     this.modalService.dismissAll();
      //   }
      // })
      // complete: () => {
      // this.files = [];

      // if(this.selectMedia) {
      //   nav.select('select');
      // } else {
      //   this.modalService.dismissAll();
      // 
      // this.selectImage.emit(this.media);
      // this.modalService.dismissAll();
      // }
    }
  }

  setImage(data: Attachment) {
    this.media = data;
  }

  // selectedMedia(modal: NgbModalRef) {
  //   this.selectImage.emit(this.media);
  //   modal.dismiss('close');
  // }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
