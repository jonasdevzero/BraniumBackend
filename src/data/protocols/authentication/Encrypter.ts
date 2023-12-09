export interface EncrypterOptions {
	expiresIn?: string;
}

export interface Encrypter {
	encrypt(value?: string, options?: EncrypterOptions): string;
}
