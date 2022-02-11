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

export function LocationsContent({mir, locations, showInfoPath, error, loadState}) {

  function makeSavedClick(path) {
    return () => {
      console.log('setting showInfoPath to ', path, 'with mir', mir);
      mir ? mir.$do.setShowInfoPath(path) : null;
    }
  }

  const columns = useMemo(() => {
    return [
      {
        property: 'uid',
        header: "UID",
        primary: true,
      },
      {
        property: 'country_regions',
        header: "Country",
      },
      {
        property: 'iso2',
        header: "ISO-2",
      },
      {
        property: 'iso3',
        header: "ISO-3",
      },
      {
        property: 'admin2',
        header: "Region",
      },
      {
        property: 'province_state',
        header: 'state'
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
        <DataTable
          data={locations}
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
