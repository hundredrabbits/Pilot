import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
	input: "../desktop/sources/scripts/pilot.js",
	output: {
		file: "bundle.js",
		format: "iife",
		name: "Pilot"
	},
	plugins: [
		nodeResolve(),
		commonjs({
			ignore: ["dgram", "fs", "path", "tone", "electron"]
		})
	]
}
