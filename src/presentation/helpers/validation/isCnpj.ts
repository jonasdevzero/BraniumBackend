export function isCnpj(cnpj: string): boolean {
	const isValid =
		/^[0-9]{14}|[0-9]{2}.[0-9]{3}.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/g.test(cnpj);
	const isValidVerifyNumber = isValidVerifyDigit(trimCnpj(cnpj));

	return isValid && isValidVerifyNumber;
}

function isValidVerifyDigit(cnpj: string): boolean {
	const digitLength = 2;
	const multiplicationLimit = 9;
	let cnpjToCompare = cnpj.slice(0, 12);

	let multiplication: number;
	let sum: number;
	let digit: number;

	for (let index = 0; index < digitLength; index++) {
		sum = 0;
		multiplication = 2;

		for (
			let currentIndex = cnpjToCompare.length - 1;
			currentIndex >= 0;
			currentIndex--
		) {
			sum += multiplication * Number(cnpjToCompare.charAt(currentIndex));
			if (++multiplication > multiplicationLimit) multiplication = 2;
		}

		digit = ((sum * 10) % 11) % 10;

		cnpjToCompare += digit;
	}

	return cnpj === cnpjToCompare;
}

function trimCnpj(cnpj: string): string {
	return cnpj.replace(/\.|\/|-/g, '');
}
