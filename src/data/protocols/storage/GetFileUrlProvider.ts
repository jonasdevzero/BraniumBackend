export interface GetFileUrlProvider {
	get(key: string): Promise<string>;
}
