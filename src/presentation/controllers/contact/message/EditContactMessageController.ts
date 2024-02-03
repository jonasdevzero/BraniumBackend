import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { EditContactMessage } from '@domain/use-cases/contact/message';
import { EditContactMessageValidator } from '@presentation/validators/contact';
import { response } from '@presentation/helpers';

@controller()
@middlewares(EditContactMessageValidator)
@route.patch('contact.message', '/:profileId/:messageId')
export class EditContactMessageController implements Controller {
	constructor(
		@inject.usecase('EditContactMessage')
		private readonly editContactMessage: EditContactMessage
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId, messageId } = httpRequest.params;
		const data = httpRequest.body;

		Object.assign(data, { profileId, messageId });

		await this.editContactMessage.edit(data);

		return response.noContent();
	}
}
