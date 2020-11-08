import * as dgram from "https://unpkg.com/browser-dgram@latest/index.js";
import * as electron from "./electron.js";
import * as fs from "./fs.js";

window.require = function(what) {
	switch (what) {
		case "dgram": return dgram; break;
		case "electron": return electron; break;
		case "tone": return Tone; break;
		case "fs": return fs; break;

		default: console.log(what); break;
	}
}
