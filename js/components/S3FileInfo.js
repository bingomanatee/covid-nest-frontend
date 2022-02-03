import React, {useMemo} from "react";
import {Box, Button, Card, CardBody, CardFooter, CardHeader, List, Text} from "grommet";
import {Close} from "grommet-icons";
import numeral from 'numeral';

function sizeNum(n) {
  if (!(typeof n === 'number')) return '--';
  return numeral(n).format('0,0')
}
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
  return (
  <div>
  <Card background="light-1" margin="large" height="300px" flex>
      <CardHeader pad="medium"><Text>File &quot;{currentFile.path}&quot;</Text></CardHeader>
      <CardBody pad="medium" flex>
        <List
        flex
          primaryKey="label"
          secondaryKey="value"
          data={[
            {
              label: 'Size',
              value: sizeNum(currentFile.file_size)
            },
            {
              label: 'Save Started',
              value: currentFile.save_started ? currentFile.save_started.toString() : '--'
            },
            {
              label: 'Save Finished',
              value: currentFile.save_finished ? currentFile.save_finished.toString() : '--'
            }
          ]}
        />
      </CardBody>
      <CardFooter pad={{horizontal: "small"}} background="light-2" >
        <Button onClick={closeClick}
          icon={<Close color="red"/>}
          hoverIndicator
          label="Close"
        />
      </CardFooter>
    </Card>
    </div>
    );
}