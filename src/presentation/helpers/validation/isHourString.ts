export function isHourString(value: string): boolean {
	return /^[0-9]{2}:[0-9]{2}$/g.test(value);
}
