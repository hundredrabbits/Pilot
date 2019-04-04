const Joi = require('joi-browser')

module.exports = {
  path: /viz#prev/,
  params: {
  },
  handler: (pilot, params) => {
    pilot.vizPrev()
  }
}
