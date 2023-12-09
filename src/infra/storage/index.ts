import { providers } from './providers';
import { ENV } from '@main/config/env';

const provider = providers[ENV.STORAGE_DRIVER];

export const GetFileUrlProvider = provider.get;
export const UploadFileProvider = provider.upload;
export const DeleteFileProvider = provider.delete;
