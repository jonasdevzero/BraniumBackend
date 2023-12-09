export interface DeleteFileProvider {
	delete(key: string): Promise<void>;
}
