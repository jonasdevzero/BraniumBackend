import { GetFileUrlProvider } from '@data/protocols';
import { ENV } from '@main/config/env';

export class GetFileUrlLocalAdapter implements GetFileUrlProvider {
	async get(key: string): Promise<string> {
		return `${ENV.BASE_STORAGE_URL}/${key}`;
	}
}
