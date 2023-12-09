import { GetFileUrlProvider } from '@data/protocols';
import { ENV } from '@main/config/env';

export class GetFileUrlLocalAdapter implements GetFileUrlProvider {
	async get(key: string): Promise<string> {
		return `http://localhost:${ENV.PORT}/uploads/${key}`;
	}
}
