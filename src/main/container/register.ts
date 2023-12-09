import { container } from '@container';
import injectables from './injectables';

for (const [key, injectable] of Object.entries(injectables)) {
	container.register(key, injectable as any);
}
