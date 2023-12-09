import { MailMessage, MailProvider } from '@data/protocols';

export class FakeProvider implements MailProvider {
	async send(
		message: MailMessage,
		meta?: Record<string, unknown>,
	): Promise<void> {
		console.log('sending mail', {
			message: message.subject,
			recipient: message.to.email,
			body: message.body,
		});
	}
}
