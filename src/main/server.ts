import 'dotenv/config';
import https from 'node:https';
import fs from 'node:fs';
import { app } from './app';
import { connectWS } from './websocket';
import { ENV } from './config/env';

const options: https.ServerOptions = {
	key: fs.readFileSync(ENV.PRIVATE_KEY),
	cert: fs.readFileSync(ENV.CERTIFICATE),
	ca: fs.readFileSync(ENV.CA),
};

const server = new https.Server(options, app);
connectWS(server);

server.listen(ENV.PORT, () => {
	console.log(`[Messages] server is running on port ${ENV.PORT}`);
});
