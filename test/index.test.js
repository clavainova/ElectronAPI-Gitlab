//dependencies
const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron')
const path = require('path')

//--------------------app launch test!--------------------


describe('Application launch', function () {
    this.timeout(100000) //longer timeout for this pc's garbage cpu

    beforeEach(function () {
        //before each test, start the electron app, located by its filepath
        console.log("app start triggered");
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')] //have confirmed with script that this is the correct path
        })
        return this.app.start() //this function behaves VERY strangely
        //for some reason starting the app has this continuous open/close loop? weird? 
        //opens 10+ windows?? but the fuction only executes one time? 
        //doesn't happen when starting via console manually?
        //absolutely slaughters the CPU. eventually, returns this error:
        //---Test failed Failed to create session.
        //---session not created: This version of ChromeDriver only supports Chrome version 91
        //---Current browser version is 89.0.4389.128 with binary path /var/www/html/Testing & Deployment/node_modules/spectron/lib/launcher.js
        //browser version: Version 95.0.4638.69 (Official Build) (64-bit)
        //electron returns memorable error ≈ "timeout, object has been destroyed"
        //also get this one from this:
        //1) "before each" hook for "shows an initial window"
    })

    afterEach(function () {
        //after each test, stop the app!
        console.log("app stop triggered");
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    })

    //does it show an initial window?
    it('shows an initial window', function () {
        console.log("testing initial window");
        return this.app.client.getWindowCount().then(function (count) {
            console.log("windows currently open: " + count);
            assert.equal(count, 1);
            done();
            // Please note that getWindowCount() will return 2 if `dev tools` are opened.
            // assert.equal(count, 2)
        })
    })
})


//second batch of tests
/*
app.start().then(function () {
    // Check if the window is visible
    return app.browserWindow.isVisible()
}).then(function (isVisible) {
    // Verify the window is visible
    assert.equal(isVisible, true)
}).then(function () {
    // Get the window's title
    return app.client.getTitle()
}).then(function (title) {
    // Verify the window's title
    assert.equal(title, 'Login')
}).then(function () {
    // Stop the application
    return app.stop()
}).catch(function (error) {
    // Log any failures
    console.error('Test failed', error.message)
})
*/
