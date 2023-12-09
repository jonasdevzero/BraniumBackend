import { MailMessage, MailProvider } from '@data/protocols';
import sendgrid, { MailDataRequired, MailService } from '@sendgrid/mail';
import { mailConfig } from '@main/config/mail';
import { HtmlToTextOptions, htmlToText } from 'html-to-text';
import DOMPurify from 'isomorphic-dompurify';

class SendGridProvider implements MailProvider {
	private client: MailService;

	constructor() {
		this.client = sendgrid;
		this.client.setApiKey(mailConfig.config.sendgrid.api_key);
	}

	async send(message: MailMessage): Promise<void> {
		const contentSanitized = this.sanitizeHtml(message.body, {
			preserveNewlines: true,
			wordwrap: 120,
		});

		const { text, html } = contentSanitized;

		const sendMailConfig: MailDataRequired = {
			from: {
				name: String(message.from.name),
				email: message.from.email,
			},
			to: {
				name: String(message.to.name),
				email: message.to.email,
			},
			subject: message.subject,
			text,
			html,
		};

		await this.client.send(sendMailConfig);
	}

	private sanitizeHtml = (content: string, options?: HtmlToTextOptions) => {
		const html = DOMPurify.sanitize(content);
		const escText = DOMPurify.sanitize(content, {
			USE_PROFILES: { html: false },
		});

		const text = htmlToText(escText, options);

		return { html, text };
	};
}

export { SendGridProvider };
