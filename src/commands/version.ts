
import {readFileSync} from 'node:fs';

export function showVersion() {
  const packageJson = JSON.parse(
    readFileSync(
      new URL('../../package.json', import.meta.url),
      'utf8'
    )
  );

  console.log(`clip v${packageJson.version}`);
}
