/** @type { import('@playwright/test').PlaywrightTestConfig } */
const config = {
    use: {
        headless: process.env.CI ? true : false,
        screenshot: 'on',
    },
    reporter: [
        ['html', {
            open: 'never',
            outputFolder: 'testresults',
        }]
    ]
};

module.exports = config;