import { FakeProvider } from './FakeProvider';
import { SMTPProvider } from './SMTPProvider';
import { SendGridProvider } from './SendGridProvider';

export const providers = {
	smtp: SMTPProvider,
	fake: FakeProvider,
	sendgrid: SendGridProvider,
};
