
import React, {useState} from 'react';
import {Box, Text} from 'ink';
import {TextInput} from '@inkjs/ui';

type Props = {
  name?: string;
};

export default function App({name}: Props) {
  const [submittedName, setSubmittedName] = useState<string | null>(
    name ?? null
  );

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Welcome to Clip CLI!
      </Text>

      {submittedName === null ? (
        <>
          <Text>What is your name?</Text>
          <TextInput
            placeholder="Enter your name..."
            onSubmit={setSubmittedName}
          />
        </>
      ) : (
        <Text color="green">
          Hello, {submittedName}!
        </Text>
      )}
    </Box>
  );
}
