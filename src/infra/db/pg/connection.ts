import { ENV } from '@main/config/env';
import pg from 'pg';

const { Pool } = pg;

const connectionString = ENV.DATABASE_URL;
export const pool = new Pool({ connectionString });
