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
import { EmitMessage } from '@domain/use-cases/message';
import { CreateContactMessageDTO } from '@domain/dtos/message/contact';

@controller()
@upload({ nested: true })
@middlewares(CreateContactMessageValidator)
@route.post('message.contact', '/')
export class CreateContactMessageController implements Controller {
	constructor(
		@inject.usecase('CreateContactMessage')
		private readonly createContactMessage: CreateContactMessage,

		@inject.usecase('EmitMessage')
		private readonly emitMessage: EmitMessage
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const data: CreateContactMessageDTO = httpRequest.body;
		const { receiver } = data;

		const messageId = await this.createContactMessage.create(data);

		this.emitMessage.emit([
			{
				messageId,
				userId: receiver.id,
				roomId: receiver.contactId,
				type: 'CONTACT',
			},
		]);

		return response.created();
	}
}
