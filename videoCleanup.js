const fs = require('fs')

// Keep a spec's video only if at least one test in it failed.
// Call from setupNodeEvents in cypress.config.js: require('./dicta-shared/videoCleanup')(on)
module.exports = (on) => {
  on('after:spec', (spec, results) => {
    if (!results || !results.video) return
    const failed = results.tests.some((t) => t.state === 'failed')
    if (!failed) fs.rmSync(results.video, { force: true })
  })
}
