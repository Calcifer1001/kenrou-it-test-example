const puppeteer = require('puppeteer');
const fs = require('fs');
const { fail } = require('assert');

async function takeScreenshot(page) {
    const folderName = 'screenshots'
    if(!(await fs.existsSync(folderName))) {
        await fs.mkdirSync(folderName)
    }
    const filename = `${folderName}/${Date.now()}.jpg`
    await page.screenshot({ path: filename })
}

test('string with a single number should result in the number itself', async () => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 10 });
  const page = await browser.newPage();
  try {

    await page.goto('http://localhost:3000');

    // Wait for suggest overlay to appear and click "show all results".
    const inputSelector = 'input[name="numbers"]';
    const submitSelector = 'input[type="submit"]';
    await page.waitForSelector(inputSelector);
    await page.$eval(inputSelector, el => el.value = '1,2');

    await page.click(submitSelector);

    

    const bodySelector = 'body'
    await page.waitForSelector(bodySelector);

    const body = await page.$eval(bodySelector, (element) => {
      return element.innerHTML
    })

    
    expect(body).toBe('Result: ' + 3);
  } catch(err) {
    await takeScreenshot(page)
    fail(`Unexpected error ${err}`)
  } finally {
    await browser.close();
  }
});