import { ENV } from '@main/config/env';
import axios from 'axios';
import fs from 'node:fs';
import https from 'node:https';

const agent = new https.Agent({
	key: fs.readFileSync(ENV.PRIVATE_KEY),
	cert: fs.readFileSync(ENV.CERTIFICATE),
	ca: fs.readFileSync(ENV.CA),
});

const service = axios.create({
	httpsAgent: agent,
	baseURL: ENV.AUTHENTICATION_URL,
});

export async function authenticateConnection(token: string) {
	try {
		const response = await service.get<string>('/auth/verify', {
			headers: { Authorization: `Bearer ${token}` },
		});

		return response.data;
	} catch (error) {
		return null;
	}
}
