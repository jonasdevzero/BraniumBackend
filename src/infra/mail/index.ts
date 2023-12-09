import { providers } from '@infra/mail/providers';
import { mailConfig } from '@main/config/mail';

export const MailProvider = providers[mailConfig.driver];
