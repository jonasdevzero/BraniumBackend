export function isCpf(cpf: string): boolean {
	return /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/g.test(cpf);
}
