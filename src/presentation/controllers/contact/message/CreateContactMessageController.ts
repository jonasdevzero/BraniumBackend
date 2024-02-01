import { inject } from '@container';
import {
	controller,
	middlewares,
	route,
	upload,
} from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateContactMessage } from '@domain/use-cases/contact/message';
import { CreateContactMessageValidator } from '@presentation/validators/contact';
import { response } from '@presentation/helpers';

@controller()
@upload({ nested: true })
@middlewares(CreateContactMessageValidator)
@route.post('contact.message', '/')
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
