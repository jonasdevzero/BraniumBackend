import { inject } from '@container';
import { CreateProfile } from '@domain/use-cases/profile';
import {
	controller,
	middlewares,
	route,
	upload,
} from '@presentation/decorators';
import { response } from '@presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateProfileValidator } from '@presentation/validators/profile';

const sizeLimit = 2 * 1024 * 1024; // 2 MB

@controller()
@upload({ mimeTypes: ['image/png', 'image/jpg', 'image/jpeg'], sizeLimit })
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
