import { inject } from '@container';
import {
	controller,
	middlewares,
	route,
	upload,
} from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { EditProfile } from '@domain/use-cases/profile';
import { EditProfileValidator } from '@presentation/validators/profile';
import { response } from '@presentation/helpers';

@controller()
@upload({
	mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
	sizeLimit: 1024 * 1024 * 4, // 4 MB
})
@middlewares(EditProfileValidator)
@route.put('profile', '/:profileId')
export class EditProfileController implements Controller {
	constructor(
		@inject.usecase('EditProfile')
		private readonly editProfile: EditProfile
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId } = httpRequest.params;
		const data = httpRequest.body;
		const [image] = httpRequest.files.image;

		Object.assign(data, { profileId });

		await this.editProfile.edit(data, image);

		return response.noContent();
	}
}
