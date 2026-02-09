const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SVG_PATH = path.join(__dirname, 'world_map.svg');
const PNG_PATH = path.join(__dirname, 'world_map.png');

async function generatePNG() {
    const svgContent = fs.readFileSync(SVG_PATH, 'utf8');

    const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; }
  body { background: #0D47A1; width: 1408px; height: 820px; overflow: hidden; }
  svg { width: 1408px; height: 820px; display: block; }
</style>
</head>
<body>${svgContent}</body>
</html>`;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1408, height: 820, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.screenshot({
        path: PNG_PATH,
        type: 'png',
        clip: { x: 0, y: 0, width: 1408, height: 820 }
    });

    await browser.close();
    console.log(`Generated ${PNG_PATH} (1408x820 @2x)`);
}

generatePNG().catch(err => {
    console.error('Error generating PNG:', err.message);
    process.exit(1);
});
