#!/usr/bin/env node

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const outputDir = resolve(rootDir, 'public', 'downloads');

async function generatePDF() {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
  });
  const page = await browser.newPage();

  try {
    mkdirSync(outputDir, { recursive: true });

    const files = [
      {
        name: 'jaeso-studio-pitch-en.html',
        output: 'jaeso-studio-pitch-en.pdf',
      },
      {
        name: 'jaeso-studio-pitch-es.html',
        output: 'jaeso-studio-pitch-es.pdf',
      },
    ];

    for (const file of files) {
      const htmlPath = resolve(__dirname, '..', file.name);
      const htmlContent = readFileSync(htmlPath, 'utf-8');
      const outputPath = resolve(outputDir, file.output);

      await page.setContent(htmlContent, { waitUntil: 'networkidle' });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        printBackground: true,
      });

      console.log(`✓ Generated: ${file.output}`);
    }

    console.log(`\nPDFs saved to: ${outputDir}`);
  } finally {
    await browser.close();
  }
}

generatePDF().catch(console.error);
