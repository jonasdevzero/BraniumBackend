import { z, ZodTypeAny } from 'zod';

export const numericString = (schema: ZodTypeAny) =>
	z.preprocess((value) => (value ? Number(value) : undefined), schema);
