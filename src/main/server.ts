import 'dotenv/config';
import https from 'node:https';
import { app } from './app';
import { connectWS } from './websocket';

const port = process.env.PORT ?? 4000;

const server = new https.Server({}, app);
connectWS(server);

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
