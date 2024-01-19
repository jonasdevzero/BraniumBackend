export interface ExistsProfileRepository {
	exists(id: string): Promise<boolean>;
}
