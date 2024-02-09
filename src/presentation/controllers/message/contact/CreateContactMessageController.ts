import { inject } from '@container';
import {
	controller,
	middlewares,
	route,
	upload,
} from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { response } from '@presentation/helpers';
import { CreateContactMessageValidator } from '@presentation/validators/message';
import { CreateContactMessage } from '@domain/use-cases/message/contact';

@controller()
@upload({ nested: true })
@middlewares(CreateContactMessageValidator)
@route.post('message.contact', '/')
export class CreateContactMessageController implements Controller {
	constructor(
		@inject.usecase('CreateContactMessage')
		private readonly createContactMessage: CreateContactMessage
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const data = httpRequest.body;

		await this.createContactMessage.create(data);

		return response.created();
	}
}
