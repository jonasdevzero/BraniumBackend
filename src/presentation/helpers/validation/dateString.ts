import { ZodTypeAny, z } from 'zod';

function parseDateToDate(value: unknown) {
	const date = new Date(String(value));

	if (Number.isNaN(date.getDate())) {
		return value;
	}

	return date;
}

export const dateString = (schema: ZodTypeAny) =>
	z.preprocess((value) => (value ? parseDateToDate(value) : undefined), schema);
