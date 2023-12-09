import { FileModel } from '@presentation/protocols';

export interface UploadFileProvider {
	upload(file: FileModel): Promise<string>;
}
