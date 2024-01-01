import { inject } from '@container';
import { controller, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { LoadProfile } from '@domain/use-cases/profile';
import { response } from '@presentation/helpers';

@controller()
@route.get('profile', '/:id')
export class LoadProfileController implements Controller {
	constructor(
		@inject.usecase('LoadProfile')
		private readonly loadProfile: LoadProfile
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { id } = httpRequest.params;

		const result = await this.loadProfile.load(id);

		return response.ok(result);
	}
}
