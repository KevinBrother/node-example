export interface UploadFile {
    file: {
        name: string;
        path: string;
    }
}

export class UploadDto {
    files!: UploadFile;
}
