const Joi = require('joi-browser')

module.exports = {
  path: /viz#next/,
  params: {
  },
  handler: (pilot, params) => {
    pilot.vizNext()
  }
}
