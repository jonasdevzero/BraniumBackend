import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { EditContact } from '@domain/use-cases/contact';
import { response } from '@presentation/helpers';
import { EditContactValidator } from '@presentation/validators/contact';

@controller()
@middlewares(EditContactValidator)
@route.put('contact', '/')
export class EditContactController implements Controller {
	constructor(
		@inject.usecase('EditContact')
		private readonly editContact: EditContact
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const data = httpRequest.body;

		await this.editContact.edit(data);

		return response.noContent();
	}
}
