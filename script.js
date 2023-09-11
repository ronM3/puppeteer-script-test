const puppeteer = require("puppeteer");
const { insertFormData } = require("./database");
const formData = [];


async function extractData() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
    );

    await page.goto("https://reverb.com/item/72854330-fishman-aura-spectrum-di",{ waitUntil: "networkidle2" });

    // click the buy it now button
    const buyNowButton = await page.$('button[class="rc-button rc-button--primary rc-button--main rc-button--medium rc-button--full-width"]');
    await buyNowButton.click();

    // click the credit card payment method
    await page.waitForSelector('button[class="payment-method-button payment-method-button--dc"]');
    await page.click('button[class="payment-method-button payment-method-button--dc"]');


    //// Contact Info ////
    await page.waitForSelector("#user_first_name");
    await page.type("#user_first_name", "avi", { delay: 50 });
    addFormData('input[id="user_first_name"]', 'value', 'avi');
 
    await page.waitForSelector("#user_last_name");
    await page.type("#user_last_name", "david", { delay: 50 });
    addFormData('input[id="user_last_name"]', 'value', 'david');

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "avi123@gmail.com", { delay: 50 });
    addFormData('input[type="email"]', 'value', 'roki@gmail.com');

    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', "avi12345", { delay: 50 });
    addFormData('input[type="password"]', 'value', 'avi12345');

    const acceptTerms = await page.$("#user_accept_terms");
    await acceptTerms.click();


    ///// Shipping address Part /////
    await page.waitForSelector('input[id="checkout[shipping_address][name]"]', {visible: true,});
    await page.type('input[id="checkout[shipping_address][name]"]',"Avi David",{ delay: 70 });
    addFormData('input[id="checkout[shipping_address][name]"]', 'value', 'Dudi Dan');

    await page.waitForSelector('input[id="address-autocomplete-input"]', {visible: true,});
    await page.type('input[id="address-autocomplete-input"]',"Tel aviv - Jaffa",{ delay: 50 });
    addFormData('input[id="address-autocomplete-input"]', 'value', 'Tel aviv - Jaffa');

    // Wait for the autocomplete dropdown to appear
    await page.waitForSelector('li[id="IL|UP|B|L2755011|ENG"]', {visible: true,});
    const selectAddress = await page.$('li[id="IL|UP|B|L2755011|ENG"]')
    await selectAddress.click()

    await page.waitForSelector('input[id="checkout[shipping_address][street_address]"]', {visible: true,});
    await page.type('input[id="checkout[shipping_address][street_address]"]',"Sheinkin 54",{ delay: 50 });
    addFormData('input[id="checkout[shipping_address][street_address]"]', 'value', 'Sheinkin 54');
                     
    // State dropdown click
    await page.waitForSelector('select[name="checkout[shipping_address][region]"]', { visible: true });
    const selectRegion = await page.$('select[name="checkout[shipping_address][region]"]')
    await selectRegion.select("TA");
    addFormData('select[name="checkout[shipping_address][region]"]', 'value', 'TA');

    await page.waitForSelector('input[id="checkout[shipping_address][postal_code]"]', {visible: true,});
    await page.type('input[id="checkout[shipping_address][postal_code]"]',"6523308",{ delay: 50 });
    addFormData('input[id="checkout[shipping_address][postal_code]"]', 'value', '6523308');

    await page.waitForSelector('input[id="checkout[shipping_address][phone]"]', {visible: true,});
    await page.type('input[id="checkout[shipping_address][phone]',"052250000",{ delay: 50 });
    addFormData('input[id="checkout[shipping_address][phone]', 'value', '052250000');

    // click the continue it now button
    const continueButton = await page.$('button[type="submit"]');
    await continueButton.click();

    /// iframe card number part ///
    const cardNumberIframe = await page.waitForSelector('iframe[title="Iframe for secured card number"]');
    const numberIframe = await cardNumberIframe.contentFrame();
    await numberIframe.waitForNavigation();
    await numberIframe.waitForSelector('input[id="encryptedCardNumber"]', { visible: true });
    await numberIframe.type('input[id="encryptedCardNumber"]', "4005550000000019", { delay: 50 });
    addFormData('input[id="encryptedCardNumber"]', 'value', '4005550000000019');

    /// iframe expiry date part ///
    const cardExpiryIframe = await page.waitForSelector('iframe[title="Iframe for secured card expiry date"]');
    const expiryIframe = await cardExpiryIframe.contentFrame();
    await expiryIframe.waitForSelector('input[id="encryptedExpiryDate"]', {visible: true,});
    await expiryIframe.type('input[id="encryptedExpiryDate"]', "0426", { delay: 50 });
    addFormData('input[id="encryptedExpiryDate"]', 'value', '0426');

    await page.bringToFront();

    /// iframe cvv part ///
    const securityCodeIframe = await page.waitForSelector('iframe[title="Iframe for secured card security code"]');
    const cardCvvIframe = await securityCodeIframe.contentFrame();
    await cardCvvIframe.waitForSelector('input[id="encryptedSecurityCode"]', {visible: true,});
    await cardCvvIframe.type('input[id="encryptedSecurityCode"]', "111", { delay: 60 })
    addFormData('input[id="encryptedSecurityCode"]', 'value', '111');

 
    // click the place order button
    await page.evaluate(() => {window.scrollBy(0, 100);});
    await page.waitForSelector('button[name="commit"]', { visible: true });
    const placeOrderButton = await page.$('button[name="commit"]');
    await placeOrderButton.click();

    for (const data of formData) {
        insertFormData(data.selector, data.property, data.value);
    }

    // connection.end();
    // await browser.close();
  } catch (error) {
    console.log(error);
  }
}

function addFormData(selector, property, value) {
    formData.push({ selector, property, value });
}

extractData();
