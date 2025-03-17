const { test, expect } = require('@playwright/test');
const { CommonLibrary } = require('../lib/common.libary');
const { LoginPage } = require('../page/login/login.pages');

let page;

test.describe('senestia', () => {
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage(); 
        const loginPage = new LoginPage(page);
        const url = 'https://www.google.com';
        const username = 'smart_line_sincere@hotmail.com';
        const password = 'pooh0821'

        await page.goto(url);
        // await loginPage.inputUsername(username);
        // await loginPage.inputPassword(password);
        // await loginPage.clickLoginButton();
    });

    test.afterAll(async () => {
        await page.close();

    });

    test('test login facebook', async () => {
        const commonLib = new CommonLibrary(page);
        //await page.waitForSelector('//div[@aria-label="เมนู"]', { state: 'visible' });
        console.log("Test ผ่านไหมนะ")
    });
});
