// t - float between 0-1. a start of range, b end of range
exports.interpolate = function (t, a, b) { return a * (1 - t) + b * t }
exports.clamp = function (v, min, max) { return v < min ? min : v > max ? max : v }
