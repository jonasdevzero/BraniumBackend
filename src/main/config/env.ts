import 'dotenv/config';
import z from 'zod';

const envSchema = z
	.object({
		NODE_ENV: z.enum(['development', 'production']).default('development'),

		PORT: z.string().default('8080').transform(Number),

		DATABASE_URL: z.string(),
		POSTGRES_PORT: z.string().default('5432').transform(Number),
		POSTGRES_USER: z.string().default('docker'),
		POSTGRES_PASSWORD: z.string().default('docker'),

		JWT_SECRET: z.string(),
		JWT_EXPIRES_IN: z.string().default('15days'),
		JWT_REFRESH_EXPIRES_IN: z.string().default('30days'),

		BASIC_USER: z.string().default('foo'),
		BASIC_PASS: z.string().default('bar'),

		SMS_DRIVER: z.enum(['fake']).default('fake'),
		MAIL_DRIVER: z.enum(['fake', 'smtp', 'sendgrid']).default('fake'),

		MAIL_SMTP_EMAIL_FROM: z.string().optional(),
		MAIL_SMTP_USER_FROM: z.string().optional(),
		MAIL_SMTP_HOST: z.string().optional(),
		MAIL_SMTP_PORT: z.string().optional().transform(Number),
		MAIL_SMTP_SSL: z.string().optional(),
		MAIL_SMTP_USERNAME: z.string().optional(),
		MAIL_SMTP_PASSWORD: z.string().optional(),

		MAIL_SENDGRID_API_KEY: z.string().optional(),

		STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),

		STORAGE_BUCKET_NAME: z.string().optional(),
		STORAGE_REGION: z.string().optional().default('us-west-1'),
		STORAGE_ENDPOINT: z.string().optional(),
		STORAGE_PUBLIC_ENDPOINT: z.string().optional(),
		STORAGE_ACCESS_KEY_ID: z.string().optional(),
		STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
	})
	.superRefine((schema, context) => {
		if (schema.STORAGE_DRIVER === 'local') return;

		if (!schema.STORAGE_BUCKET_NAME) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'STORAGE_BUCKET_NAME is required!',
				fatal: true,
			});
		}

		if (!schema.STORAGE_REGION) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'STORAGE_REGION is required!',
				fatal: true,
			});
		}

		if (!schema.STORAGE_PUBLIC_ENDPOINT) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'STORAGE_PUBLIC_ENDPOINT is required!',
				fatal: true,
			});
		}

		if (!schema.STORAGE_ACCESS_KEY_ID) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'STORAGE_ACCESS_KEY_ID is required!',
				fatal: true,
			});
		}

		if (!schema.STORAGE_SECRET_ACCESS_KEY) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'STORAGE_SECRET_ACCESS_KEY is required!',
				fatal: true,
			});
		}
	});

export const ENV = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
	const result = envSchema.safeParse(process.env);
	if (!result.success) return result.error.issues;
};
