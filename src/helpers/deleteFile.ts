import fs from 'node:fs';

async function fileExists(location: string) {
	try {
		await fs.promises.stat(location);
		return true;
	} catch (error) {
		return false;
	}
}

export async function deleteFile(location: string) {
	if (!(await fileExists(location))) return;

	await fs.promises.unlink(location);
}
