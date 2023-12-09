export function isDate(date: string): boolean {
	try {
		const parsed = new Date(date);
		return !Number.isNaN(parsed.getDate());
	} catch (error) {
		return false;
	}
}
