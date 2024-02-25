import { GetFileUrlProvider } from '@data/protocols';
import { inject } from '@main/container';
import { controller, route } from '@presentation/decorators';
import { response } from '@presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';

@controller()
@route.get('file', '/:key')
export class GetFileUrlController implements Controller {
	constructor(
		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { key } = httpRequest.params;

		const url = await this.getFileUrlProvider.get(key);

		return response.ok({ url });
	}
}
