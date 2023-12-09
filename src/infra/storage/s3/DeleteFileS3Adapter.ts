import { DeleteFileProvider } from '@data/protocols';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { storageConfig } from '@main/config/storage';

export class DeleteFileS3Adapter implements DeleteFileProvider {
	private readonly s3: S3Client;

	constructor() {
		const { endpoint, accessKeyId, secretAccessKey } = storageConfig;

		if (!endpoint) {
			throw new Error('Storage Image required Endpoint');
		}

		if (!accessKeyId) {
			throw new Error('Storage Image required access key id');
		}

		if (!secretAccessKey) {
			throw new Error('Storage Image required secret access key');
		}

		this.s3 = new S3Client({
			endpoint,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
			region: storageConfig.region,
		});
	}

	async delete(Key: string): Promise<void> {
		await this.s3.send(
			new DeleteObjectCommand({
				Bucket: storageConfig.bucketName,
				Key,
			}),
		);
	}
}
