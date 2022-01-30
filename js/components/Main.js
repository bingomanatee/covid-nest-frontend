import React from 'react';
import { Grommet, Paragraph, Heading, Main } from 'grommet';

export default () => {
  return (
    <Grommet plain>
      <Main>
        <Heading>Covid Data</Heading>
        <Paragraph>A new wave</Paragraph>
        <Heading level={2}>Github Files</Heading>
      </Main>
    </Grommet>
  )
};