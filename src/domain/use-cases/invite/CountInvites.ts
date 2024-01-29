export interface CountInvites {
	count(profileId: string): Promise<number>;
}
