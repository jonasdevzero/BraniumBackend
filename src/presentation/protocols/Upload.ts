import { IncomingMessage } from 'node:http';
import { Controller } from './Controller';

export interface FileModel {
	filename: string;
	location: string;
	mimetype: string;
}

export interface UploadOptions {
	/** Bytes */
	sizeLimit?: number;
	mimeTypes?: string[];
	nested?: boolean;
}

export interface UploadResult {
	data: Record<string, unknown>;
	files: Record<string, FileModel[]>;
	uploadedFiles: Array<FileModel>;
}

export type UploadController = Controller & {
	multipart(request: IncomingMessage): Promise<UploadResult>;
};
