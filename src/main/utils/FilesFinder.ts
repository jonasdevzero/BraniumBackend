import fs from 'node:fs';
import path from 'node:path';

export class FilesFinder {
	find(dir: string, matcher: RegExp): string[] {
		const files: string[] = [];

		const foundedFiles = fs.readdirSync(dir);

		for (const file of foundedFiles) {
			const fullPath = path.join(dir, file);

			if (matcher.test(file)) files.push(fullPath);
			if (this.isDirectory(file)) files.push(...this.find(fullPath, matcher));
		}

		return files;
	}

	private isDirectory(path: string): boolean {
		return !this.isFile(path);
	}

	private isFile(path: string): boolean {
		return /.+(\..+)$/g.test(path);
	}
}
