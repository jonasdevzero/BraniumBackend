import { inject } from '@container';
import { CreateProfile } from '@domain/use-cases/profile';
import { controller, middlewares, route } from '@presentation/decorators';
import { response } from '@presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateProfileValidator } from '@presentation/validators/profile';

@controller()
@middlewares(CreateProfileValidator)
@route.post('profile', '/')
export class CreateProfileController implements Controller {
	constructor(
		@inject.usecase('CreateProfile')
		private readonly createProfile: CreateProfile
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const data = httpRequest.body;
		const [image] = httpRequest.files.image;

		await this.createProfile.create(data, image);

		return response.created();
	}
}
