import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { ListContactMessages } from '@domain/use-cases/contact/message';
import { ListContactMessagesValidator } from '@presentation/validators/contact';
import { response } from '@presentation/helpers';
import { ListContactMessagesDTO } from '@domain/dtos/contact';

@controller()
@middlewares(ListContactMessagesValidator)
@route.get('contact.message', '/:profileId/:contactId')
export class ListContactMessagesController implements Controller {
	constructor(
		@inject.usecase('ListContactMessages')
		private readonly listContactMessages: ListContactMessages
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId, contactId } = httpRequest.params;
		const data = httpRequest.query as ListContactMessagesDTO;

		Object.assign(data, { userId: profileId, contactId });

		const result = await this.listContactMessages.list(data);

		return response.ok(result);
	}
}
