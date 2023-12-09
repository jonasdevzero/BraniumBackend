import { GetFileUrlProvider } from '@data/protocols';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storageConfig } from '@main/config/storage';

export class GetFileUrlS3Adapter implements GetFileUrlProvider {
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

	async get(Key: string): Promise<string> {
		const command = new GetObjectCommand({
			Key,
			Bucket: storageConfig.bucketName,
		});

		const url = await getSignedUrl(this.s3, command);

		return url;
	}
}
