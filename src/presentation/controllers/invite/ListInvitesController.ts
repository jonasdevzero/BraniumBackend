import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { ListInvites } from '@domain/use-cases/invite';
import { ListInvitesValidator } from '@presentation/validators/invite';
import { response } from '@presentation/helpers';

@controller()
@middlewares(ListInvitesValidator)
@route.get('invite', '/:profileId')
export class ListInvitesController implements Controller {
	constructor(
		@inject.usecase('ListInvites')
		private readonly listInvites: ListInvites
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId } = httpRequest.params;
		const data = httpRequest.query;

		Object.assign(data, { profileId });

		const result = await this.listInvites.list(data);

		return response.ok(result);
	}
}
