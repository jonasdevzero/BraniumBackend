import busboy from 'busboy';
import fs from 'node:fs';
import path from 'node:path';
import { IncomingMessage } from 'node:http';
import { Controller } from '../protocols';
import { FileModel, UploadOptions, UploadResult } from '../protocols';
import { BadRequestError } from '@presentation/errors';
import { uploadConfig } from '@main/config/upload';
import { deleteFile } from '@helpers';

type Class<T> = { new (...args: any[]): T };

export function upload(options: UploadOptions = {}) {
	const { mimeTypes: allowedTypes, nested } = options;

	return function decorator<T extends Class<Controller>>(
		constructor: T
	): T | void {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);
			}

			async multipart(request: IncomingMessage): Promise<UploadResult> {
				const bb = busboy({
					headers: request.headers,
					limits: {
						fileSize: options.sizeLimit,
					},
				});

				const data: Record<string, unknown> = {};
				const files: Record<string, FileModel[]> = {};

				const uploadPromises: Array<Promise<unknown>> = [];
				const uploadedFiles: Array<FileModel> = [];

				try {
					await new Promise<unknown>(async (resolve, reject) => {
						bb.on('field', (name, value) => {
							if (nested) {
								setNestedProperty(data, name, value);
								return;
							}

							data[name] = data[name] ? [data[name], value] : value;
						});

						bb.on('file', (name, file, info) => {
							const { mimeType } = info;

							if (allowedTypes && !allowedTypes.includes(mimeType)) {
								reject(
									new BadRequestError(`Mimetype not allowed: ${mimeType}`)
								);
								return;
							}

							const filename = `${Date.now()}-${info.filename}`;
							const location = path.join(uploadConfig.folder, filename);
							const fileData = { filename, location, mimetype: mimeType };

							if (nested) setNestedProperty(data, name, fileData);

							files[name]
								? files[name].push(fileData)
								: (files[name] = [fileData]);
							uploadedFiles.push(fileData);

							const promise = new Promise<void>((close) => {
								file
									.on('limit', () => {
										reject(new BadRequestError('File size limit exceeded'));
									})
									.on('error', reject)
									.pipe(fs.createWriteStream(location))
									.on('error', reject)
									.on('close', close);
							});

							uploadPromises.push(promise);
						});

						bb.on('close', async () => {
							await Promise.all(uploadPromises).then(resolve).catch(reject);
						});

						request.pipe(bb).on('error', reject);
					});
				} catch (error) {
					await Promise.all(uploadedFiles.map((f) => deleteFile(f.location)));
					throw error;
				}

				return { data, files, uploadedFiles };
			}
		};
	};
}

function setNestedProperty(
	obj: Record<string, unknown>,
	path: string,
	value: any
): void {
	const keys = path.split('.');
	const lastKey = keys.pop()!;
	let current = obj;

	keys.forEach((key, index) => {
		const isNextKeyIndex = !Number.isNaN(+keys[index + 1]);

		const parsedKey = Number.isNaN(+key) ? key : +key;
		const defaultValue = isNextKeyIndex ? [] : {};

		current[parsedKey] = current[parsedKey] || defaultValue;

		current = current[parsedKey] as Record<string, unknown>;
	});

	current[lastKey] = value;
}
