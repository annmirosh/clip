
import React, {useEffect, useState} from 'react';
import {Box, Text, useApp} from 'ink';
import {
  convertToWebp,
  type ConversionResult
} from './to-webp.js';

export default function ToWebpView() {
  const {exit} = useApp();

  const [results, setResults] =
    useState<ConversionResult[] | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void convertToWebp()
      .then(setResults)
      .catch((err: unknown) => {
        process.exitCode = 1;
        setError(
          err instanceof Error ? err.message : String(err)
        );
      });
  }, []);

  useEffect(() => {
    if (results !== null || error !== null) {
      exit();
    }
  }, [results, error, exit]);

  if (error !== null) {
    return <Text color="red">Error: {error}</Text>;
  }

  if (results === null) {
    return <Text color="yellow">Converting images...</Text>;
  }

  const converted = results.filter(
    result => result.status === 'success'
  ).length;

  const failed = results.filter(
    result => result.status === 'error'
  ).length;

  if (failed > 0) {
    process.exitCode = 1;
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Clip Image Converter
      </Text>

      {results.length === 0 && (
        <Text color="yellow">
          No supported images found.
        </Text>
      )}

      {results.map((result) => (
        <Text key={result.file}>
          {result.status === 'success' ? (
            <Text color="green">
              ✓ {result.file} → {result.output}
            </Text>
          ) : (
            <Text color={
              result.status === 'error' ? 'red' : 'yellow'
            }>
              {result.status === 'error' ? '✗' : '–'}{' '}
              {result.file}: {result.message}
            </Text>
          )}
        </Text>
      ))}

      <Text color="green">
        Converted {converted} image(s).
      </Text>
    </Box>
  );
}
