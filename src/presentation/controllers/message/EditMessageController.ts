import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { EditMessage } from '@domain/use-cases/message';
import { response } from '@presentation/helpers';
import { EditMessageValidator } from '@presentation/validators/message';

@controller()
@middlewares(EditMessageValidator)
@route.patch('message', '/:profileId/:messageId')
export class EditMessageController implements Controller {
	constructor(
		@inject.usecase('EditMessage')
		private readonly editMessage: EditMessage
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId, messageId } = httpRequest.params;
		const data = httpRequest.body;

		Object.assign(data, { id: messageId });

		await this.editMessage.edit(data, profileId);

		return response.noContent();
	}
}
