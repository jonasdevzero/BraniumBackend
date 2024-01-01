import { ENV } from '@main/config/env';
import postgres from 'postgres';

export const sql = postgres(ENV.DATABASE_URL, {
	transform: { undefined: null },
});
