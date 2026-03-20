const fs = require('fs');
const marked = require('marked');
const puppeteer = require('puppeteer');
const path = require('path');


function fontToDataUrl(fontPath) {
  const font = fs.readFileSync(fontPath);
  return `data:font/ttf;base64,${font.toString('base64')}`;
}

async function mdToPdf(mdPath, pdfPath, palette) {
  const md = fs.readFileSync(mdPath, 'utf-8');
  const html = marked.parse(md);
  // Embed fonts as base64 data URLs
  const fontDir = path.join(__dirname, '../fonts');
  const regular = fontToDataUrl(path.join(fontDir, 'JetBrainsMono-Regular.ttf'));
  const bold = fontToDataUrl(path.join(fontDir, 'JetBrainsMono-Bold.ttf'));
  const thinItalic = fontToDataUrl(path.join(fontDir, 'JetBrainsMono-ThinItalic.ttf'));
  const css = paletteToCss(palette, { regular, bold, thinItalic });
  const htmlDoc = `<!DOCTYPE html><html><head><meta charset='utf-8'><style>${css}</style></head><body>${html}</body></html>`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(htmlDoc, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: 40, bottom: 40, left: 40, right: 40 } });
  await browser.close();
}



function paletteToCss(palette, fonts) {
  // Safe zone (margins) and code block styling
  return `
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('${fonts.regular}') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('${fonts.bold}') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('${fonts.thinItalic}') format('truetype');
      font-weight: 100;
      font-style: italic;
    }
    body {
      background: ${palette.background};
      color: ${palette.foreground};
      font-family: 'JetBrains Mono', monospace;
      margin: 0;
      font-weight: ${palette.bodyWeight};
      padding: ${palette.marginTop || 60}px ${palette.marginRight || 50}px ${palette.marginBottom || 60}px ${palette.marginLeft || 50}px;
      box-sizing: border-box;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: ${palette.headingWeight};
    }
    a { color: ${palette.linkColor}; }
    .muted { color: ${palette.muted}; }
    pre, code {
      background: ${palette.codeBg || '#161b22'};
      color: ${palette.codeFg || '#7ee787'};
      font-family: 'JetBrains Mono', monospace;
      border-radius: 4px;
      padding: 2px 6px;
    }
    pre {
      padding: 12px;
      overflow-x: auto;
    }
  `;
}

module.exports = { mdToPdf };
