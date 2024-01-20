export interface EditContactDTO {
	profileId: string;
	contactId: string;

	name?: string;
	blocked?: boolean;
}
