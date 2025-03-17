const { CommonLibrary } = require("../../lib/common.libary");
const { loginLocators } = require('../../locators/login.locators');

class LoginPage extends CommonLibrary {

    constructor(page) {
        super(page);
    }

    async goToURL(url) {
        try {
            await page.goto(url, { waitUntil: 'load', timeout: 10000 });
        } catch (error) {
            // if something in the "try" fails, you have access to `page` and `browser` objects here
            // and you can treat the errors, or simply log to console and close the page/browser. E.g.:
            if (error.message.includes('ERR_CONNECTION_CLOSED')) {
                console.log('Oopps...');
                await page.close();
                await browser.close();
            }
        }
    }

    async inputUsername(username) {
        await super.inputText(loginLocators.txt_username, username);
    }

    async inputPassword(password) {
        await super.inputText(loginLocators.txt_password, password);
    }

    async clickLoginButton() {
        await super.clickOnElement(loginLocators.btn_login);
        await this.page.waitForSelector(loginLocators.btn_login, {state: 'hidden'});
    }

    async login(username, password) {
        await this.inputUsername(username);
        await this.inputPassword(password);
        await this.page.waitForTimeout(10000);
        await this.clickLoginButton();
    }

    async verifyGlobalMessage(text) {
        await super.verifyText(loginLocators.label_successGlobalMessage, text);
    }
}
module.exports = { LoginPage };