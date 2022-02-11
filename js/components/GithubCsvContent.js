import _ from "lodash";
import axios from "axios";
import React, {useMemo} from "react";
import {Checkmark, Close, Github, Info} from "grommet-icons";
import {Box, Button, DataTable, Text} from "grommet";
import {TailSpin} from "react-loader-spinner";
import {S3FileInfo} from "./S3FileInfo";
import numeral from 'numeral';

function makeClick(path) {
  return _.once(
    () => {
      axios.put('/api/github-csv', {path});
    });
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
        property: 'size',
        header: 'Size (bytes)',
        render: (data) => (
        <Box fill="horizontal" align="end">
        <Text alignSelf="end" textAlign="end">
        {numeral(data.size).format('0,0')}
        </Text>
        </Box>
        )
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
      return <Box direction={'column'} flex>
        {showInfoPath ? <Text>Show Info Path: <b>{showInfoPath}</b></Text> : ''}
        <DataTable
          data={data}
          columns={columns}
        />
      </Box>
        ;
      break;

    case 'error':
      return <Text color="status-error">{error}</Text>;
      break;

    default:
      return <Text>Waiting to Load</Text>;
  }
}
