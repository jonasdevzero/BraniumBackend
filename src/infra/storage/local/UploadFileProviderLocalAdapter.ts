import fs from 'node:fs';
import path from 'node:path';
import { UploadFileProvider } from '@data/protocols';
import { FileModel } from '@presentation/protocols';
import { uploadConfig } from '@main/config/upload';

export class UploadFileProviderLocalAdapter implements UploadFileProvider {
	async upload(file: FileModel): Promise<string> {
		const location = path.join(uploadConfig.folder, 'uploads', file.filename);

		await fs.promises.rename(file.location, location);

		return file.filename;
	}
}
