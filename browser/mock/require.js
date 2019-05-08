const dgram = {
	createSocket() {
		return {
			on() {},
			bind() {}
		}
	}
}

const electron = {
	remote: {}
};
const fs = {};
const path = {};

function require(what) {
	switch (what) {
		case "dgram": return dgram; break;
		case "tone": return Tone; break;
		case "fs": return fs; break;
		case "path": return path; break;
		case "electron": return electron; break;
		default: throw new Error(`Trying to require(${what}) failed`); break;
	}
}
