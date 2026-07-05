import { PaginateModel } from "./core.interface";

export interface AttachmentModel extends PaginateModel {
    data: Attachment[];
}

export interface Attachment {
    code: number;
    name: string;
    description: string;
    file_name: string;
    mime_type: string;
    original_url: string;
    extension: string;
    size: string | number;
    error?: string;
}