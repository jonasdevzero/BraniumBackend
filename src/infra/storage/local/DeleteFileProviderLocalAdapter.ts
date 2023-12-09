import path from 'node:path';
import { DeleteFileProvider } from '@data/protocols';
import { uploadConfig } from '@main/config/upload';
import { deleteFile } from '@helpers';

export class DeleteFileProviderLocalAdapter implements DeleteFileProvider {
	async delete(key: string): Promise<void> {
		await deleteFile(path.join(uploadConfig.folder, 'uploads', key));
	}
}
