import path from 'node:path';
import { ENV } from './env';

const baseStorageUrl = `http://localhost:${ENV.PORT}/uploads`;

const folder = path.join(process.cwd(), 'temp');

export const uploadConfig = Object.freeze({
	folder,
	baseStorageUrl,
});
