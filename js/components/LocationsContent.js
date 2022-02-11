import _ from "lodash";
import axios from "axios";
import React, {useMemo} from "react";
import {Checkmark, Close, Github, Info} from "grommet-icons";
import {Box, Button, DataTable, Text, Select} from "grommet";
import {TailSpin} from "react-loader-spinner";
import {S3FileInfo} from "./S3FileInfo";
import numeral from 'numeral';

function makeClick(path) {
  return _.once(
    () => {
      axios.put('/api/github-csv', {path});
    });
}

export function LocationsContent({mir, locations, showInfoPath, error, loadState, states, stateSearchString}) {
  console.log('states:', states);
  const columns = useMemo(() => {
    return [
      {
        property: 'uid',
        header: "UID",
        primary: true,
      },
      {
        property: 'country_region',
        header: "Country",
      },
      {
        property: 'province_state',
        header: 'State'
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
      return (
      <Box direction="row">
      <Box>
      <Text>View locations in state:</Text>
        <Select onSearch={(value) => mir.$do.setStateSearchString(value)} 
        selectPlaceholder="enter a state name to filter" options={states} />
        </Box>
        <DataTable
          data={locations}
          columns={columns}
          fill={true}
          step={20}
          paginate={true}
        />
        </Box>
        );
      break;

    case 'error':
      return <Text color="status-error">{error}</Text>;
      break;

    default:
      return <Text>Waiting to Load - {loadState} </Text>;
  }
}
