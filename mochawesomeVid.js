import addContext from 'mochawesome/addContext'

// Link failed tests to their video. Passing specs' videos are deleted (videoCleanup.js).
// In CI the videos are a 7-day artifact on the run page (CYPRESS_RUN_URL);
// locally the link points at the video file next to the report.
Cypress.on("test:after:run", (test, runnable) => {
    if (test.state !== 'failed') return

    const runUrl = Cypress.env('RUN_URL')
    if (runUrl) {
        addContext({ test }, { title: 'Video (kept 7 days)', value: runUrl + '#artifacts' })
        return
    }

    let videoName = Cypress.spec.name
    videoName = videoName.replace(/\.js.*/, '.js')
    addContext({ test }, 'videos/' + videoName + '.mp4')
});
