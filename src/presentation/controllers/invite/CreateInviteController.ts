import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateInvite } from '@domain/use-cases/invite';
import { CreateInviteValidator } from '@presentation/validators/invite';
import { response } from '@presentation/helpers';

@controller()
@middlewares(CreateInviteValidator)
@route.post('invite', '/')
export class CreateInviteController implements Controller {
	constructor(
		@inject.usecase('CreateInvite')
		private readonly createInvite: CreateInvite
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const data = httpRequest.body;

		await this.createInvite.create(data);

		return response.noContent();
	}
}
