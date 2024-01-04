import 'dotenv/config';
import z from 'zod';

const envSchema = z
	.object({
		NODE_ENV: z.enum(['development', 'production']).default('development'),

		PORT: z.string().default('8080').transform(Number),

		PRIVATE_KEY: z.string().default('ssl/key.pem'),
		CERTIFICATE: z.string().default('ssl/cert.pem'),
		CA: z.string().default('ssl/ca-cert.pem'),

		DATABASE_URL: z.string(),
		POSTGRES_PORT: z.string().default('5432').transform(Number),
		POSTGRES_USER: z.string().default('docker'),
		POSTGRES_PASSWORD: z.string().default('docker'),

		STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
		BASE_STORAGE_URL: z.string(),

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
