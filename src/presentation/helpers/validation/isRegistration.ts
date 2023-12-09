import { isCnpj } from './isCnpj';
import { isCpf } from './isCpf';

export function isRegistration(registration: string): boolean {
	return isCnpj(registration) || isCpf(registration);
}
