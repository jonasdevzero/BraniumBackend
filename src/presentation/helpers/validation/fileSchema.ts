import { z } from 'zod';

export const fileSchema = z.object({
	location: z.string(),
	filename: z.string(),
	mimetype: z.string(),
});
