#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { Command } from '@commander-js/extra-typings';
import { version } from '../package.json';
import { Converter } from '../lib/converter';

const outputOption = ['md', 'SVG'];

const program = new Command();

program
  .name('msc')
  .requiredOption('-f, --file <File>', 'File name')
  .requiredOption(`-o, --output <${outputOption.join('|')}>`, 'Output format')
  .version(version)
  .action(({ file, output }) => {
    const markdown = readFileSync(file, 'utf8');
    let convertedResult = markdown;

    if (!outputOption.includes(output))
      console.warn('No matching conversion output format found, so no conversion');

    if (output === 'md') {
      console.log('Convert to markdown');
      convertedResult = Converter.toMarkdown(markdown);
    }

    if (output === 'SVG') {
      console.log('Convert to SVG');
      convertedResult = Converter.toSVG(markdown);
    }

    writeFileSync(file, convertedResult);
  })
  .parse();
