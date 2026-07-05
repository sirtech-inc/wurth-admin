import { Attachment, Images } from "@shared/interface";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, } from "@angular/core";

import { AlertModalComponent } from "../modal/alert-modal/alert-modal.component";
import { MediaFilesModalComponent } from "../modal/media-files-modal/media-files-modal.component";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styles: `
   .file-upload-find-files{
    .attachment:hover{
        background-color: rgba(#43b3e3, 0.75);
        border-radius : 20px 0 0 20px;
        > i {
          color: white;
        }
      }
    .search{
      &:hover{
        background-color: rgba(#43b3e3, 0.75);
        border-radius : 0 20px 20px 0;
        > i {
          color: white;
        }
      }
    }
   }
  `
})
export class FileUploadComponent implements OnInit {


  @ViewChild("alertModal", { static: false }) AlertModal: AlertModalComponent;
  @ViewChild("mediaFilesModal", { static: false }) mediaFilesModal: MediaFilesModalComponent
  @ViewChild("fileInput", { static: false }) fileInput: any;

  @Input() allowExtensions: string[] = ["xls", "xlsx", "pdf", "png", "jpg", "jpeg"];
  @Input() allowMultiple: boolean = false;
  @Input() attachment: Attachment | null;
  @Input() attachments: Attachment[] = [];
  @Input() findFiles: boolean = false;
  @Input() findFilesTypes: "pdf" | "image";
  @Input() maxUploads: number = 1;
  @Input() module: string;
  @Input() sizeMaxUploadMb = 1; //1024 * 1024;
  @Input() textInfo: string;
  @Input() textInfoLang: boolean;
  @Input() showLoader:boolean;

  @Output() selectedFilesOut: EventEmitter<File[] | File> = new EventEmitter();
  @Output() filesRegistered: EventEmitter<Attachment[]> = new EventEmitter();
  @Input() onDeleteFile?: (file: Attachment, index: number) => void;

  opened: boolean = false;

  public selectedFiles: File[] | null = [];
  public showFiles: Attachment[] = [];

  ngOnInit(): void {
    if (this.attachment) {
      this.showFiles.push(this.attachment);
    }
    if (this.attachments && this.attachments.length > 0) {
      this.showFiles.push(...this.attachments);
    }
  }

  onSelectedFiles(files: FileList) {
    let error = false;
    const selectedFiles: File[] = [];
    if (
      this.validateFilesFormat(files) === true &&
      this.validateFilesSize(files) === true
    ) {
      for (let i = 0; i < files.length; i++) {
        if (this.showFiles.length + i >= this.maxUploads && error === false) {
          this.AlertModal.openModal("global_message_upload_file_exceded");
          error = true;
        }

        if (!error) {
          selectedFiles.push(files.item(i));
          this.selectedFiles.push(files.item(i));
        }
      }
    }

    if (error === false) {

      this.attachments = selectedFiles.map((file: File, index: number) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (file.type.includes("image")) {
            this.attachments[index].original_url = reader.result as string;
          }
        }
        return {
          code: null,
          description: file.name,
          name: file.name,
          file_name: file.name,
          mime_type: file.type,
          extension: file.name.split(".").pop(),
          original_url: null,
          size: file.size,
        };

      });

      this.showFiles = [...this.attachments, ...this.showFiles];

      if (this.maxUploads === 1) {
        this.selectedFilesOut.emit(this.selectedFiles[0]);
      } else {
        this.selectedFilesOut.emit(this.selectedFiles);
      }
    }
    this.fileInput.nativeElement.value = "";
  }

  validateFilesFormat(files: FileList): boolean {
    let checkFormat = Array.from(files).every((file) =>
      this.allowExtensions.includes(file.name.split(".").pop())
    );
    if (!checkFormat) {
      this.AlertModal.openModal("global_message_invalid_file_format");
      return false;
    }
    return true;
  }

  private convertMBtoBytes(mb: number): number {
    return mb * 1024 * 1024;
  }

  protected formatSize(size: number, MbToBytes?: boolean): string {
    if (MbToBytes) {
      size = this.convertMBtoBytes(size);
    }
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  validateFilesSize(files: FileList): boolean {
    let checkSize = Array.from(files).every(
      (file) => file.size <= this.convertMBtoBytes(this.sizeMaxUploadMb)
    );
    if (!checkSize) {
      this.AlertModal.openModal("global_message_file_size_exceded");
      return false;
    }
    return true;
  }

  onRemove(index: number) {
    const removedFile = this.showFiles[index];
    this.showFiles.splice(index, 1);
    this.attachments.splice(index, 1);
    this.selectedFiles.splice(index, 1);

    this.filesRegistered.emit(this.attachments);
    if (this.onDeleteFile) {
      this.onDeleteFile(removedFile, index);
    }
    
    if (this.selectedFiles?.length <= 0) {
      this.selectedFilesOut.emit(null);
    } else {
      this.selectedFilesOut.emit(this.selectedFiles);
    }

  }

  onFindFiles() {
    this.opened = true;
    setTimeout(() => { this.mediaFilesModal.openModal() })
  }

  onSelectFile(file: Images) {
    if (this.showFiles.length >= this.maxUploads) {
      this.AlertModal.openModal("global_message_upload_file_exceded");
      return
    }


    this.showFiles.push({
      code: file.code,
      description: file.description,
      name: file.name,
      file_name: file.file_name,
      mime_type: file.mime_type,
      extension: null,
      original_url: file.original_url,
      size: file.size,
    });
    this.filesRegistered.emit(this.showFiles);
  }
}
