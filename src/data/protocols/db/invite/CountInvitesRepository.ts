export interface CountInvitesRepository {
	count(profileId: string): Promise<number>;
}
