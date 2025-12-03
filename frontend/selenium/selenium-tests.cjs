const {Builder, By, until} = require('selenium-webdriver');

async function runTests() {
    // 1. Start Chrome
    let driver = await new Builder().forBrowser('chrome').build();

    // Simple unique email per run
    const random = Date.now();
    const testUser = {
        name: 'Selenium Test User',
        email: `selenium${random}@example.com`,
        password: 'StrongPass123!'
    };

    try {
        // UC-2: Register Account
        console.log('TC-UC2-01: Register Account - start');

        await driver.get('http://localhost:5173/register');

        // Wait for page to load and field to appear
        await driver.wait(
            until.elementLocated(By.id('name')),
            10000,
            "Register page did not load correctly"
        );

        await driver.findElement(By.id('name')).sendKeys(testUser.name);
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).sendKeys(testUser.password);

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for redirect to login page
        await driver.wait(until.urlContains('/login'), 5000);
        console.log('TC-UC2-01: Register Account - PASS');

        // UC-3: Log In
        console.log('TC-UC3-01: Login with valid credentials - start');

        await driver.findElement(By.id('email')).clear();
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).clear();
        await driver.findElement(By.id('password')).sendKeys(testUser.password);

        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for redirect to /account
        await driver.wait(until.urlContains('/account'), 5000);

        // Check that account page shows the user’s email somewhere
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        if (!bodyText.includes(testUser.email)) {
            throw new Error('Account page does not show user email');
        }

        console.log('TC-UC3-01: Login with valid credentials - PASS');

        // UC-4: Add cookie to cart
        console.log('TC-UC4-01: Add cookie to cart - start');

        await driver.get('http://localhost:5173/cookies');

        // Wait for any "Add to Cart" button
        const addButton = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Add to Cart')]")),
            10000,
            'No Add to Cart buttons found – check database'
        );

        // Click the first Add to Cart button
        await addButton.click();

        // Wait for React to update cart state
        await driver.sleep(1500);

        // Now go to the cart page using UI navigation
        await driver.get('http://localhost:5173/cart');

        // Wait for cart table to appear
        await driver.wait(
            until.elementLocated(By.css('table')),
            10000,
            'Cart table did not appear'
        );

        // Check there is at least one item
        const rows = await driver.findElements(By.css('table tbody tr'));
        if (rows.length === 0) {
            throw new Error('Cart is empty after adding item');
        }

        console.log('TC-UC4-01: Add cookie to cart - PASS');

        // UC-5: View Account while logged in
        console.log('TC-UC5-01: View Account when logged in - start');

        await driver.get('http://localhost:5173/account');

        await driver.wait(until.urlContains('/account'), 5000);

        const accountPageText = await driver.findElement(By.tagName('body')).getText();
        if (!accountPageText.includes(testUser.email)) {
            throw new Error('Account page not showing correct user');
        }

        console.log('TC-UC5-01: View Account when logged in - PASS');

    } catch (err) {
        console.error('Selenium test FAILED:', err.message);
    } finally {
        // Always close the browser
        await driver.quit();
    }
}

runTests();
