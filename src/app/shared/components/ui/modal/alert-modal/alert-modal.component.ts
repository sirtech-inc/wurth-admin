import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styles: ``
})
export class AlertModalComponent {

  public modalOpen: boolean = false;
  @ViewChild("alertModal", { static: false }) AlertModal: TemplateRef<string>;
  // @Input() message : string;
  public message: string

  constructor(private modalService: NgbModal) { }

  async openModal(message: string) {
    this.message = message;
    this.modalOpen = true;
    this.modalService.open(this.AlertModal, {
      ariaLabelledBy: 'Alert-Modal',
      centered: true,
      windowClass: 'theme-modal text-center'
    }).result.then((result) => {
      // `Result ${result}`
    }, (reason) => {
      //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }



}
