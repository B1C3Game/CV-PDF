const fs = require('fs');
const path = require('path');

function loadPalettes(palettesDir) {
  const files = fs.readdirSync(palettesDir).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const data = fs.readFileSync(path.join(palettesDir, f), 'utf-8');
    return JSON.parse(data);
  });
}

function selectPalette(palettes, prompt) {
  if (palettes.length === 1) return palettes[0];
  const inquirer = require('inquirer');
  return inquirer.prompt([
    {
      type: 'list',
      name: 'palette',
      message: prompt || 'Select a palette:',
      choices: palettes.map(p => ({ name: p.name, value: p }))
    }
  ]).then(ans => ans.palette);
}

module.exports = { loadPalettes, selectPalette };
