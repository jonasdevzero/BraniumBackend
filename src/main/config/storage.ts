import { ENV } from '@main/config/env';

export type StorageDriver = 'local' | 's3';

interface StorageConfig {
	driver: StorageDriver;

	bucketName?: string;
	keyFilename?: string;

	region?: string;
	endpoint?: string;
	publicEndpoint?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
}

export const storageConfig: StorageConfig = {
	driver: ENV.STORAGE_DRIVER,

	bucketName: ENV.STORAGE_BUCKET_NAME,

	region: ENV.STORAGE_REGION,
	endpoint: ENV.STORAGE_ENDPOINT,
	publicEndpoint: ENV.STORAGE_PUBLIC_ENDPOINT,
	accessKeyId: ENV.STORAGE_ACCESS_KEY_ID,
	secretAccessKey: ENV.STORAGE_SECRET_ACCESS_KEY,
};
