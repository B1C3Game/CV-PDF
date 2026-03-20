
# md2pdf

Markdown to PDF converter for CVs and documents.

## Implementation Instructions

1. Ensure all three JetBrains Mono font files (`JetBrainsMono-Regular.ttf`, `JetBrainsMono-Bold.ttf`, `JetBrainsMono-ThinItalic.ttf`) are present in the `fonts/` directory.
2. Run `npm install` to install dependencies.
3. Convert your Markdown file to PDF:
    ```sh
    npx md2pdf your-cv.md
    ```

The tool will prompt for a palette if multiple are available. Output PDF will be generated in the same directory as your input file (unless otherwise specified).


## Font Usage

This project uses three JetBrains Mono font variants, each with a specific role:

- **JetBrainsMono-Regular.ttf**: Main body text and general content for optimal readability.
- **JetBrainsMono-Bold.ttf**: Section headings, titles, and emphasis to provide clear structure and hierarchy.
- **JetBrainsMono-ThinItalic.ttf**: Accents, muted notes, or secondary information—ideal for subtle details or de-emphasized text.

All fonts are bundled locally in the `fonts/` directory. No runtime downloads required.

---

## Pipeline

.md → marked parses to HTML → CSS styles it → Puppeteer opens it in Chromium → Chromium's print-to-PDF → .pdf

So:

- marked converts your markdown to HTML
- Your palette CSS makes it look right (fonts, margins, colors, safe zone)
- Puppeteer opens that styled HTML in headless Chromium
- Chromium's PDF renderer prints it to file

You're basically using Chrome's print engine as your PDF generator. That's why the output looks professional. It's the same renderer that handles Ctrl+P in any browser, just automated.

## Directory Structure

```
md2pdf/
├── README.md
├── package.json
├── fonts/
│   ├── JetBrainsMono-Regular.ttf
│   ├── JetBrainsMono-Bold.ttf
│   └── JetBrainsMono-ThinItalic.ttf
├── node_modules/
├── palettes/
│   └── b1c3-cv.json  ← your CV palette
└── src/
    ├── cli.js         ← entry point
    ├── convert.js     ← md → html → pdf (puppeteer)
    ├── palette.js     ← palette loader + mode selector
    └── index.js       ← exports
```
