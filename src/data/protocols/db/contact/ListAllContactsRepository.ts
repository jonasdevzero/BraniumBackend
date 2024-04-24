export interface ListAllContactsRepository {
	list(profileId: string): Promise<string[]>;
}
