import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { ResponseInvite } from '@domain/use-cases/invite';
import { ResponseInviteValidator } from '@presentation/validators/invite';
import { response } from '@presentation/helpers';

@controller()
@middlewares(ResponseInviteValidator)
@route.post('invite', '/response')
export class ResponseInviteController implements Controller {
	constructor(
		@inject.usecase('ResponseInvite')
		private readonly responseInvite: ResponseInvite
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const data = httpRequest.body;

		await this.responseInvite.response(data);

		return response.noContent();
	}
}
