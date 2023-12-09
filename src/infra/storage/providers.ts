import {
	DeleteFileProviderLocalAdapter,
	GetFileUrlLocalAdapter,
	UploadFileProviderLocalAdapter,
} from './local';
import {
	DeleteFileS3Adapter,
	GetFileUrlS3Adapter,
	UploadFileS3Adapter,
} from './s3';

export const providers = {
	local: {
		get: GetFileUrlLocalAdapter,
		upload: UploadFileProviderLocalAdapter,
		delete: DeleteFileProviderLocalAdapter,
	},
	s3: {
		get: GetFileUrlS3Adapter,
		upload: UploadFileS3Adapter,
		delete: DeleteFileS3Adapter,
	},
};
