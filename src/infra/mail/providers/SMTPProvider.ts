import { MailMessage, MailProvider } from '@data/protocols';
import { mailConfig } from '@main/config/mail';
import nodemailer, { Transporter } from 'nodemailer';

export class SMTPProvider implements MailProvider {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport(mailConfig.config.smtp);
	}

	async send(message: MailMessage): Promise<void> {
		await this.transporter.sendMail({
			from: {
				name: String(message.from.name),
				address: message.from.email,
			},
			to: {
				name: String(message.to.name),
				address: message.to.email,
			},
			subject: message.subject,
			html: message.body,
		});
	}
}
