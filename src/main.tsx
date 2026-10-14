#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import App from './App.js';
import ToWebpView from './commands/ToWebpView.js';
import {showVersion} from './commands/version.js';
import {
  showCompletion,
  installCompletion
} from './commands/completion.js';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'version':
  case '--version':
  case '-v':
    showVersion();
    break;

  case 'to-webp':
    render(<ToWebpView />);
    break;

  case 'hello':
    render(<App name={args[1]} />);
    break;

  case '--help':
  case '-h':
    console.log(`
Clip CLI

Commands:
  clip              Start interactive mode
  clip version      Show CLI version
  clip to-webp      Convert images to WebP
  clip hello [name] Say hello
  clip --help       Show help
`);
    break;

  case undefined:
    render(<App />);
    break;

  case 'completion':
    showCompletion();
    break;

  case 'install-completion':
    installCompletion();
    break;

  default:
    console.error(`Unknown command: ${command}`);
    process.exitCode = 1;
}
