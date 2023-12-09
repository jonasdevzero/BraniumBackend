import { ZodError } from 'zod';
import { ValidationError } from '@presentation/errors';

export function makeZodError(error: ZodError): ValidationError {
	const meta = error.issues.map((issue) => ({
		field: issue.path.join('.'),
		message: issue.message,
	}));

	return new ValidationError(meta);
}
