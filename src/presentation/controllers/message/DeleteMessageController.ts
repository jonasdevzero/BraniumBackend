import { inject } from '@container';
import { controller, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { DeleteMessage } from '@domain/use-cases/message';
import { response } from '@presentation/helpers';

@controller()
@route.delete('message', '/:profileId/:messageId')
export class DeleteMessageController implements Controller {
	constructor(
		@inject.usecase('DeleteMessage')
		private readonly deleteMessage: DeleteMessage
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId, messageId } = httpRequest.params;

		await this.deleteMessage.delete(profileId, messageId);

		return response.noContent();
	}
}
