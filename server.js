const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer');

const launchOptions = {
  args: [
    // Required for Docker version of Puppeteer
    '--no-sandbox',
    '--disable-setuid-sandbox',
    // This will write shared memory files into /tmp instead of /dev/shm,
    // because Docker’s default for /dev/shm is 64MB
    '--disable-dev-shm-usage'
  ]
};

async function screenshotDOMElement(page, selector, padding = 0) {
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const {x, y, width, height} = element.getBoundingClientRect();
    return {left: x, top: y, width, height, id: element.id};
  }, selector);

  return await page.screenshot({
    encoding: 'binary',
    // path: 'element.png', // save image?
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  });
}

app.get('/', (req, res) => {
  console.log('TRYING TO GET IMAGE');
  // TODO: change name of width and height to pageWidth and pageHeight (since it is the viewport)
  // TODO?: option to pass in image height, width, x, y
  const { link, selector, width, height } = req.query;

  // TODO: validation check on query

  (async () => {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setViewport({
      width: parseInt(width),
      height: parseInt(height),
      deviceScaleFactor: 1,
    });
    await page.goto(link); // TODO: must be valid url

    let screenshot = null;
    if (selector) {
      screenshot = await screenshotDOMElement(page, selector, 0);
    } else {
      // TODO: if no selector get whole page...
    }

    await browser.close();

    if (screenshot) {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': screenshot.length
      });
      res.end(screenshot);
    } else {
      res.send('Fail to get image');
    }
  })();
});

app.get('/hello', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`listening on port ${port}!`))