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

async function main() {
  switch (command) {
    // Show CLI version
    case 'version':
    case '--version':
    case '-v':
      showVersion();
      break;

    // Convert images in current directory to WebP
    case 'to-webp':
    case '2-webp':
      render(<ToWebpView />);
      break;

    // Interactive hello command
    case 'hello':
      render(<App name={args[1]} />);
      break;

    // Shell completion
    case 'completion':
      switch (args[1]) {
        case 'zsh':
          await showCompletion();
          break;

        case 'install':
          await installCompletion();
          break;

        default:
          console.log(`
Usage:
  clip completion zsh      Print Zsh completion script
  clip completion install  Install Zsh completion
`);
      }
      break;

    // Help
    case '--help':
    case '-h':
    case 'help':
      console.log(`
Clip CLI

Usage:
  clip <command> [options]

Commands:
  version              Show CLI version
  to-webp              Convert images in current folder to WebP
  hello [name]         Say hello
  completion zsh       Print Zsh completion script
  completion install   Install Zsh completion

Options:
  -v, --version        Show version
  -h, --help           Show help

Examples:
  clip version
  clip to-webp
  clip hello Anna
  clip completion install
`);
      break;

    // No arguments: start Ink interface
    case undefined:
      render(<App />);
      break;

    // Unknown command
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "clip --help" for available commands.');
      process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(
    'Error:',
    error instanceof Error ? error.message : String(error)
  );
  process.exitCode = 1;
});
