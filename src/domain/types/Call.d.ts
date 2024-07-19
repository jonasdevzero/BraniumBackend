export namespace Call {
	type Signal = RTCSessionDescriptionInit;

	interface Media {
		audio: boolean;
		video: boolean;
	}

	interface Connection {
		id: string;
		signal: Signal;
	}

	interface Start {
		connection: Connection;
		media: Media;
	}

	interface Income {
		from: string;
		signal: Signal;
		media: Media;
	}

	interface ListUsers {
		id: string;
		users: string[];
	}

	interface IceCandidate {
		id: string;
		candidate: RTCIceCandidate;
	}
}
