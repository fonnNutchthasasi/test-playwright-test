/** @type { import('@playwright/test').PlaywrightTestConfig } */
const config = {
    //workers: process.env.CI ? 1 : undefined,
    use: {
        headless: false,
        screenshot: 'on',
    },
    reporter: [
        ['html',
            {
                open: 'never',
                outputFolder: 'testresults'
            }
        ]
    ]
};

module.exports = config;