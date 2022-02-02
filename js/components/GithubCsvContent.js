import _ from "lodash";
import axios from "axios";
import React, {useMemo, useState} from "react";
import {Checkmark, Close, Github, Info} from "grommet-icons";
import {Button, Box, List, Card, CardBody, CardFooter, CardHeader, DataTable, Text} from "grommet";
import {TailSpin} from "react-loader-spinner";

function makeClick(path) {
  return _.once(
    () => {
      axios.put('/api/github-csv', {path});
    });
}

function S3FileInfo({ mir,sourceFiles, showInfoPath}) {
  const closeClick = useMemo(() => {
    return () => {
      if (mir) {
        mir.$do.setShowInfoPath('');
      }
    }
  }, [mir]);

  if (!showInfoPath) return '';
  const currentFile = Array.isArray(sourceFiles)  ? sourceFiles.find((file) => file.path === showInfoPath) : null;
  if (!currentFile) return '';
  return <Box flex>
    <Card  height="small" width="small" background="light-1">
    <CardHeader pad="medium">File &quot;{ currentFile.path }</CardHeader>
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
            value: currentFile.save_started? save_started.toString() : '--'
          },
          {
            label: 'Save Finished',
            value: currentFile.save_finished? save_started.toString() : '--'
          }
        ]}
      />
    </CardBody>
    <CardFooter pad={{horizontal: "small"}} background="light-2" onClick={closeClick} >
      <Button
        icon={<Close color="red" />}
        hoverIndicator
      />
    </CardFooter>
  </Card>  </Box>
}

export function GithubCsvContent({mir, data, showInfoPath, error, loadState, sourceFiles}) {

  function makeSavedClick(path) {
    return () => {
      console.log('setting showInfoPath to ', path, 'with mir', mir);
      mir ? mir.$do.setShowInfoPath(path) : null;
    }
  }

  const columns = useMemo(() => {
    return [
      {
        property: 'path',
        header: "Resource Path",
        primary: true,
      },
      {
        property: 'sha',
        header: 'SHA'
      },
      {
        property: 'isStored',
        header: "Is Stored",
        render: ({isStored}) => {
          return isStored ? <Checkmark/> : <Close/>;
        }
      },
      {
        header: 'Write To S3',
        render: ({path}) => <Button onClick={makeClick(path)} icon={<Github/>} label={'Write to S3'}/>
      },
      {
        header: 'Saved Info',
        render: ({path}) => <Button onClick={makeSavedClick(path)} icon={<Info/>} label={'info'}/>
      }
    ]
  }, []);

  switch (loadState) {
    case 'start':
      return <TailSpin/>;
      break;

    case 'loading':
      return <TailSpin/>;
      break;

    case 'loaded':
      return <>
        {showInfoPath ? <Text>Show Info Path: <b>{showInfoPath}</b></Text> : ''}
        <S3FileInfo mir={mir} sourceFiles={sourceFiles} showInfoPath={showInfoPath} />
        <DataTable
          data={data}
          columns={columns}
        />
      </>
        ;
      break;

    case 'error':
      return <Text color="status-error">{error}</Text>;
      break;

    default:
      return <Text>Waiting to Load</Text>;
  }
}