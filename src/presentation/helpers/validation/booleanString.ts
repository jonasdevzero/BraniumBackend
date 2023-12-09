import { ZodTypeAny, z } from 'zod';
import { parseBooleanString } from '../parseBooleanString';

const isBooleanString = (value: unknown) =>
	['true', 'false'].includes(String(value));

export const booleanString = (schema: ZodTypeAny) =>
	z.preprocess(
		(value) =>
			isBooleanString(value) ? parseBooleanString(String(value)) : undefined,
		schema.refine((value) => (value ? isBooleanString(String(value)) : true)),
	);
