import { inject } from '@container';
import { controller, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CountInvites } from '@domain/use-cases/invite';
import { response } from '@presentation/helpers';

@controller()
@route.get('invite', '/:profileId/count')
export class CountInvitesController implements Controller {
	constructor(
		@inject.usecase('CountInvites')
		private readonly countInvites: CountInvites
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId } = httpRequest.params;

		const result = await this.countInvites.count(profileId);

		return response.ok(result);
	}
}
