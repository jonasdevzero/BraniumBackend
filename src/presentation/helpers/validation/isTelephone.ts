export function isTelephone(telephone: string): boolean {
	return /\([0-9]{2}\) [0-9]{5}-[0-9]{4}/g.test(telephone);
}
