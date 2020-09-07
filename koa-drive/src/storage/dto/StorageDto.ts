export interface StorageDto {
    code: string;
    type?: string;
    data: {
        [name: string]: string | number | boolean | object | symbol | Date;
    };
}
