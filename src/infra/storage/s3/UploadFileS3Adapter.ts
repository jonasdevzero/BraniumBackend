import { storageConfig } from '@main/config/storage';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadFileProvider } from '@data/protocols';
import { FileModel } from '@presentation/protocols';
import fs from 'node:fs';

export class UploadFileS3Adapter implements UploadFileProvider {
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

	async upload(file: FileModel): Promise<string> {
		const buffer = await fs.promises.readFile(file.location);

		const Key = `${Date.now()}-${file.filename}`;

		await this.s3.send(
			new PutObjectCommand({
				Body: buffer,
				Key,
				Bucket: storageConfig.bucketName,
				ACL: 'public-read',
			}),
		);

		return Key;
	}
}
