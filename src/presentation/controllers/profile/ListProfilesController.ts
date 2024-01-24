import { ListProfilesDTO } from '@domain/dtos/profile';
import { ListProfiles } from '@domain/use-cases/profile';
import { inject } from '@main/container';
import { controller, middlewares, route } from '@presentation/decorators';
import { response } from '@presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { ListProfilesValidator } from '@presentation/validators/profile';

@controller()
@middlewares(ListProfilesValidator)
@route.get('profile', '/list/:profileId')
export class ListProfilesController implements Controller {
	constructor(
		@inject.usecase('ListProfiles')
		private readonly listProfiles: ListProfiles
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId } = httpRequest.params;
		const data = httpRequest.query as ListProfilesDTO;

		Object.assign(data, { profileId });

		const result = await this.listProfiles.list(data);

		return response.ok(result);
	}
}
