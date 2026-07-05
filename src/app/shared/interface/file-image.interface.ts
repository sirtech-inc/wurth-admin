export interface ImageData {
    datos: Images[];
}

export interface Upload {
    code: number;
    description: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: string;
    module: string;
    original_url: string;
}

export interface Images extends Upload {
    date_create: string;
}

export interface Files extends Upload {
    date_create: string;
}