const NormalRange = require('../lib/types/NormalRangeSchema')
const Milliseconds = require('../lib/types/MillisecondsSchema')

exports.settings = {
  delayTime: Milliseconds.description('The delayTime of the DelayNode.'),
  feedback: NormalRange.description('The amount of signal which is fed back into the effect input.'),
  wet: NormalRange.description('The wet control is how much of the effected will pass through to the output. 1 = 100% effected signal, 0 = 100% dry signal.')
}
