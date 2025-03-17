const loginLocators = {
    txt_username: '//input[@id="email"]',
    txt_password: '//input[@id="pass"]',
    btn_login: '//button[@name="login"]',
    loginSuccessPanel: 'a[id=button-menu-dividers]',
    label_successGlobalMessage: '//div[contains(@class,"alert-success")]/span[2]',
}

 module.exports = { loginLocators };