class CommonLibrary {
    constructor(page) {
        page.setDefaultTimeout(parseInt(process.env.GLOBAL_ELEMENT_WAIT));
        this.page = page;
    }

    async waitForObjectAppear(locator) {
        await this.page.$(locator);
    }

    /**
     * @usage : use for wait for pacman or loading icon disappear
     * @example : waitForLoadingIconDisappear();
     */
    async waitForLoadingIconDisappear() {
        await this.page.waitForSelector('//div[contains(@class,"loading-text")]//p', {state: 'hidden'});
        // await this.page.isHidden('//div[contains(@class,"loading-text")]//p');
    }

//========================================================================
//========================  Functional
//========================================================================
    /**
     * @usage : Input value in text box , text area
     * @example : inputText(locator, 'abc');
     */
    async inputText(locator, value) {
        await this.page.waitForTimeout(400);
        let text = value.toString();
        if (text.includes("@random")) {
            let splitText = text.split('::');
            let randomNo = parseInt(splitText[1]);
            let newText = this.randomText(randomNo);
            await this.page.fill(locator, newText);
            return newText;
        } else {
            await this.page.fill(locator, text);
            return text;
        }
    }

    /**
     * Click on any element
     * @usage : use for all buttons/links/checkbox in application such as Create button, Next button
     * @example : clickOnElement(obj_create);
     */
    async clickOnElement(locator) {
        await this.page.waitForSelector(locator);
        await this.page.dispatchEvent(locator, 'click');
        await this.page.waitForLoadState("load");
        await this.page.waitForTimeout(500);
    }

    /**
     * Mouse hover on object
     * @usage : use for all buttons/links/checkbox/image in application such as image
     * @example : mouseHoverOnElement(obj_create);
     */
     async mouseHoverOnElement(locator) {
        await this.page.hover(locator);
    }

    /**
     * @usage : Input search and Select single or multi value from combo box, drop down list that allow to search.
     * In case of multi value, please use splitor '::' (double colon) to separate word.
     * @example : searchAndSelectValue(locator, 'TDNE-01::TDCE-01');
     */
    async searchAndSelectValue(locator, value) {
        let str_text = value.toString();
        if (str_text.includes('::')) {
            let list_text = str_text.split('::');
            for (let i = 0; i < list_text.length; i++) {
                let expand_prefix = '//div[@role="option"]';
                let option_1 = '//following::span[normalize-space()="' + list_text[i] + '"]';
                let option_2 = '//following::div/span[normalize-space()="' + list_text[i] + '"]';
                let option_3 = '//following::div[normalize-space()="' + list_text[i] + '"]';
                const expand_loc = expand_prefix + '|' + expand_prefix + option_1 + '|' + expand_prefix + option_2 + '|' + expand_prefix + option_3;
                await this.page.waitForTimeout(process.env.GLOBAL_WAIT);
                await this.page.fill(locator, list_text[i]);
                await this.page.waitForLoadState('load');
                await this.page.waitForTimeout(2000);
                await this.page.click(expand_loc,'Enabled');
                console.log(`Search and Select value [${value}].`)
            }
        } else {
            let expand_prefix = '//div[@role="option"]';
            let option_1 = '//following::span[normalize-space()="' + str_text + '"]';
            let option_2 = '//following::div/span[normalize-space()="' + str_text + '"]';
            let option_3 = '//following::div[normalize-space()="' + str_text + '"]';
            const expand_loc = expand_prefix + '|' + expand_prefix + option_1 + '|' + expand_prefix + option_2 + '|' + expand_prefix + option_3;
            await this.page.waitForTimeout(process.env.GLOBAL_WAIT);
            await this.page.fill(locator, str_text);
            await this.page.waitForLoadState('load');
            await this.page.waitForTimeout(2000);
            await this.page.click(expand_loc, 'Enabled');
            console.log(`Search and Select value [${value}].`)
        }
    }

    /**
     * Select single or multi value from combo box, drop down list.
     * In case of multi value, please use splitor '::' (double colon) to separate word.
     * @usage : trade type , client name, notification list
     * @example : selectValue(obj_trade, 'Commercial::Residential');
     */
    async selectValueFromList(locator, value) {
        let str_text = value.toString();
        if (str_text.includes('::')) {
            let list_text = str_text.split('::');
            for (let i = 0; i < list_text.length; i++) {
                const loc_expand = `//div[@role="option"]/span[normalize-space()="${list_text[i]}"]`;
                await this.page.click(locator);
                await this.waitForObjectAppear('//div[contains(@class,"ng-dropdown-panel-items")]');
                await this.page.dispatchEvent(loc_expand, 'click');
                await this.page.waitForTimeout(200);
                console.log(`Select value [${value}].`)
            }
        } else {
            const loc_expand = `//div[@role="option"]/span[normalize-space()="${value}"]`;
            await this.page.click(locator);
            await this.waitForObjectAppear('//div[contains(@class,"ng-dropdown-panel-items")]');
            await this.page.dispatchEvent(loc_expand, 'click');
            await this.page.waitForTimeout(200);
            console.log(`Select value [${value}].`)
        }
    }

    /**
     * @usage : Get actual text from current element then compare with expected value
     * @example : verifyText(locator, 'ABCD');
     */
    async verifyText(locator, expectedValue) {
        await this.page.waitForTimeout(process.env.GLOBAL_WAIT);
        let actual = await this.getText(locator);
        console.log(`Expected Value is ${expectedValue} on locator : ${locator}`)
        await expect(actual.trim()).toEqual(expectedValue.trim());
        console.log(`Actual value: [${actual}] is matched with Expected : [${expectedValue}]`)
    }

    /**
     * @usage : Get actual value from current element then compare with expected value
     * @example : verifyValue(locator, 'ABCD');
     */
    async verifyValue(locator, expectedValue) {
        await this.page.waitForLoadState("load");
        await expect(this.page).toEqualValue(locator, expectedValue);
    }

    /**
     * Get text from label
     * @usage : Get text or value and store value
     * @example : getText(locator);
     */
    async getText(locator) {
        let value = await this.page.innerText(locator);
        console.log(`Get value [${value}] from ${locator}`);
        return value;
    }

    /**
     * Get value from input or text area
     * @usage : Get text or value and store value
     * @example : getText(locator);
     */
    async getValue(locator) {
        let value = await this.page.inputValue(locator);
        console.log(`Get value [${value}] from ${locator}`);
        return value;
    }

    /**
     * @usage : Random number and text
     * @example : randomCode(5);
     */
    randomCode(length) {
        let randomLength = length;
        let generateRandomCode = '';
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = randomLength; i > 0; --i)
            generateRandomCode += chars[Math.floor(Math.random() * chars.length)];
        return generateRandomCode;
    }

    /**
     * @usage : Random number only
     * @example : randomNo(5);
     */
    randomNo(length) {
        let randomLength = length;
        let generateRandomCode = '';
        let chars = '0123456789';
        for (let i = randomLength; i > 0; --i)
            generateRandomCode += chars[Math.floor(Math.random() * chars.length)];
        return generateRandomCode;
    }

    /**
     * @usage : Random text only
     * @example : randomText(5);
     */
    randomText(length) {
        let randomLength = length;
        let generateRandomCode = '';
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = randomLength; i > 0; --i)
            generateRandomCode += chars[Math.floor(Math.random() * chars.length)];
        return generateRandomCode;
    }

    /**
     * @usage : Random time in millisec only
     * @example : randomTime(1000, 10000);
     */
     randomTime(min ,max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * @usage : Use for browse or attach file
     * @example : uploadFile(locator, './uploadDocument/image.png');
     */
    async uploadFile(locator, file) {
        // await this.page.$(locator).setInputFiles(file);
        await this.page.waitForTimeout(process.env.GLOBAL_WAIT);
        const handle = await this.page.$(locator);
        await handle.setInputFiles(file);
    }

    /**
     * @usage : Use for download the file
     * @example : downloadFile(locator, 'report.xlsx');
     */
    async downloadFile(locator, saveFileName) {
        const [ download ] = await Promise.all([
            this.page.waitForEvent('download', {timeout: 60000}), // wait for download to start
            this.page.click(locator),
        ]);
        // wait for download to complete
        await download.saveAs('./downloadedDocument/' + saveFileName);
    }

    /**
     * @usage : Use for convert string to x,xxx format and return value
     * @example : convertNumberToStringWithCommaFormat(4900);
     */
    convertNumberToStringWithCommaFormat(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * @usage : Use for convert number to string format and return value
     * @example : convertNumberToStringWithCommaFormat(4900);
     */
    convertNumberToStringFormat(value) {
        return {
            comma_NoDecimal: value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            comma_decimal: value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        }
    }
}
module.exports = { CommonLibrary };


