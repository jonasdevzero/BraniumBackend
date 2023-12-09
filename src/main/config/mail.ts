import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ENV } from './env';

interface MailConfig {
	driver: 'smtp' | 'fake' | 'sendgrid';
	userFrom: string;
	emailFrom: string;
	config: {
		smtp: SMTPTransport.Options;
		fake: object;
		sendgrid: {
			api_key: string;
		};
	};
}

const setBoolean = (value: any) => {
	try {
		return Number(value) === 1;
	} catch (error) {
		return false;
	}
};

export const mailConfig: MailConfig = {
	driver: ENV.MAIL_DRIVER,
	userFrom: ENV.MAIL_SMTP_USER_FROM || '',
	emailFrom: ENV.MAIL_SMTP_EMAIL_FROM || '',
	config: {
		smtp: {
			host: ENV.MAIL_SMTP_HOST,
			port: ENV.MAIL_SMTP_PORT,
			secure: setBoolean(ENV.MAIL_SMTP_SSL),
			auth: {
				user: ENV.MAIL_SMTP_USERNAME,
				pass: ENV.MAIL_SMTP_PASSWORD,
			},
		},
		fake: {},
		sendgrid: {
			api_key: String(ENV.MAIL_SENDGRID_API_KEY),
		},
	},
};
