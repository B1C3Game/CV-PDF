const path = require('path');
const { loadPalettes, selectPalette } = require('./palette');
const { mdToPdf } = require('./convert');

async function runCli() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: md2pdf <input.md> [output.pdf]');
    process.exit(1);
  }
  const mdPath = args[0];
  const pdfPath = args[1] || mdPath.replace(/\.md$/, '.pdf');
  const palettes = loadPalettes(path.join(__dirname, '../palettes'));
  const palette = await selectPalette(palettes);
  await mdToPdf(mdPath, pdfPath, palette);
  console.log(`PDF generated: ${pdfPath}`);
}

module.exports = { runCli };
