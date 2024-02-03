export function removeUndefinedProps<O extends {}>(obj: O) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop) && obj[prop] === undefined) {
			delete obj[prop];
		}
	}
}
