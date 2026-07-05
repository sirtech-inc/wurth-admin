
export class UploadFileImage {
    static readonly type = "[FileImage] Upload";
    constructor(public payload: File,
        public modeData?: 'queryString' | 'formData',
        public extraData?: {},
        public multiple?: boolean) { }
}

export class UploadFileAttachment {
    static readonly type = '[Upload] File Attachment';
    constructor(public payload: File,
        public modeData?: 'queryString' | 'formData',
        public extraData?: {},
        public multiple?: boolean) { }
}

export class ListImages {
    static readonly type = "[FileImage] List";
    constructor(public type_module: string) { }
}  