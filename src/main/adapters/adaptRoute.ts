import { Request, Response } from 'express';
import { adaptUpload } from './adaptUpload';
import {
	Controller,
	FileModel,
	HttpRequest,
	UploadController,
} from '@presentation/protocols';
import { response as responseUtil } from '@presentation/helpers';
import { deleteFile } from '@helpers';

export const adaptRoute = (controller: Controller) => {
	return async (request: Request, response: Response) => {
		const httpRequest: HttpRequest = {
			body: request.body,
			files: {},
			query: request.query as Record<string, string>,
			params: request.params as Record<string, string>,
			headers: request.headers,
			user: { id: '' },
		};

		const contentType = request.headers['content-type'] || '';
		const isMultipart = contentType.startsWith('multipart/form-data');
		let tempFiles: FileModel[] = [];

		if (isMultipart) {
			try {
				const multipart = await adaptUpload(
					request,
					controller as UploadController
				);

				Object.assign(httpRequest, {
					body: multipart.data,
					files: multipart.files,
				});
				tempFiles = multipart.uploadedFiles;
			} catch (error) {
				const httpResponse = responseUtil.error(error as Error);
				return response.status(httpResponse.statusCode).send(httpResponse.body);
			}
		}

		const httpResponse = await controller.handle(httpRequest);

		response.status(httpResponse.statusCode);
		response.send(httpResponse.body);

		await Promise.all(tempFiles.map((file) => deleteFile(file.location)));
	};
};
