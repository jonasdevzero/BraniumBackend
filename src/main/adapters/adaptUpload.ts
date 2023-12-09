import { IncomingMessage } from 'node:http';
import { BadRequestError } from '@presentation/errors';
import { UploadController, UploadResult } from '@presentation/protocols';

export async function adaptUpload(
	request: IncomingMessage,
	controller: UploadController,
): Promise<UploadResult> {
	const { multipart } = controller;

	if (!multipart) {
		throw new BadRequestError('Multipart not allowed to this route');
	}

	return await multipart(request);
}
