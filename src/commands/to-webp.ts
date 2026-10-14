
import {readdir, stat} from 'node:fs/promises';
import {join, parse} from 'node:path';
import sharp from 'sharp';

const supportedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.tif',
  '.tiff',
  '.avif',
]);

export type ConversionResult = {
  file: string;
  output?: string;
  status: 'success' | 'skipped' | 'error';
  message?: string;
};

export async function convertToWebp(
  directory = process.cwd()
): Promise<ConversionResult[]> {
  const entries = await readdir(directory, {
    withFileTypes: true
  });

  const results: ConversionResult[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const {name, ext} = parse(entry.name);

    if (!supportedExtensions.has(ext.toLowerCase())) {
      continue;
    }

    const input = join(directory, entry.name);
    const outputName = `${name}.webp`;
    const output = join(directory, outputName);

    try {
      // Never overwrite an existing output file.
      try {
        await stat(output);
        results.push({
          file: entry.name,
          status: 'skipped',
          message: `${outputName} already exists`
        });
        continue;
      } catch (error) {
        if (
          (error as NodeJS.ErrnoException).code !== 'ENOENT'
        ) {
          throw error;
        }
      }

      await sharp(input)
        .webp({quality: 80})
        .toFile(output);

      results.push({
        file: entry.name,
        output: outputName,
        status: 'success'
      });
    } catch (error) {
      results.push({
        file: entry.name,
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : String(error)
      });
    }
  }

  return results;
}
