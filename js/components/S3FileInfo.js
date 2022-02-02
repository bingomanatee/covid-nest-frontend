import React, {useMemo} from "react";
import {Box, Button, Card, CardBody, CardFooter, CardHeader, List} from "grommet";
import {Close} from "grommet-icons";

export function S3FileInfo({mir, sourceFiles, showInfoPath}) {
  const closeClick = useMemo(() => {
    return () => {
      if (mir) {
        mir.$do.setShowInfoPath('');
      }
    }
  }, [mir]);

  if (!showInfoPath) {
    return '';
  }
  const currentFile = Array.isArray(sourceFiles) ? sourceFiles.find((file) => file.path === showInfoPath) : null;
  console.log('--- s3FileInfo - currentFile = ', currentFile, 'path = ', showInfoPath);
  if (!currentFile) {
    return '';
  }
  return <Box flex>
    <Card height="small" width="small" background="light-1">
      <CardHeader pad="medium">File &quot;{currentFile.path}</CardHeader>
      <CardBody pad="medium">
        <List
          primaryKey="label"
          secondaryKey="value"
          data={[
            {
              label: 'Size',
              value: currentFile.file_size
            },
            {
              label: 'Save Started',
              value: currentFile.save_started ? save_started.toString() : '--'
            },
            {
              label: 'Save Finished',
              value: currentFile.save_finished ? save_started.toString() : '--'
            }
          ]}
        />
      </CardBody>
      <CardFooter pad={{horizontal: "small"}} background="light-2" onClick={closeClick}>
        <Button
          icon={<Close color="red"/>}
          hoverIndicator
        />
      </CardFooter>
    </Card>
  </Box>
}