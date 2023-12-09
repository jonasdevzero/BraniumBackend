export function isCep(cep: string): boolean {
	return /[0-9]{5}-[0-9]{3}/g.test(cep);
}
