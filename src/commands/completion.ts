
import {readFile, mkdir, writeFile, appendFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import {join} from 'node:path';

const completionSource = new URL(
  '../../completions/_clip',
  import.meta.url
);

export async function showCompletion() {
  const script = await readFile(completionSource, 'utf8');
  process.stdout.write(script);
}

export async function installCompletion() {
  const home = homedir();
  const completionDir = join(home, '.zsh', 'completions');
  const completionFile = join(completionDir, '_clip');
  const zshrc = join(home, '.zshrc');

  // Create the completion directory
  await mkdir(completionDir, {recursive: true});

  // Write the completion script
  const script = await readFile(completionSource, 'utf8');
  await writeFile(completionFile, script, 'utf8');

  // Read the existing Zsh configuration
  let config = '';

  try {
    config = await readFile(zshrc, 'utf8');
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code !== 'ENOENT'
    ) {
      throw error;
    }
  }

  const marker = '# Clip CLI completion';

  if (!config.includes(marker)) {
    // Prepend setup so it runs before existing compinit.
    const setup = [
      marker,
      'fpath=("$HOME/.zsh/completions" $fpath)',
      'autoload -Uz compinit',
      'compinit',
      ''
    ].join('\n');

    // Keep a copy before changing the original.
    await writeFile(`${zshrc}.clip-backup`, config, {
      flag: 'wx'
    }).catch(error => {
      if (
        (error as NodeJS.ErrnoException).code !== 'EEXIST'
      ) {
        throw error;
      }
    });

    await writeFile(zshrc, setup + config, 'utf8');
  }

  console.log('✓ Zsh completion installed!');
  console.log(`  Script: ${completionFile}`);
  console.log('  Run: exec zsh');
}
