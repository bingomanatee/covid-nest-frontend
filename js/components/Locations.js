import {Box, Heading, Paragraph, Text} from "grommet";
import React, {useEffect, useState} from 'react';
import {Mirror} from '@wonderlandlabs/mirror';
import axios from "axios";
import {LocationsContent} from "./LocationsContent";

export function Locations() {
  const [values, setValues] = useState({});
  const [mir, setMir] = useState(null);

  useEffect(() => {
    const dataMir = new Mirror({
      loadState: 'start',
      error: false,
      locations: [],
      locationsLoadState: 'start',
      locationsError: false,
      showInfoPath: '',
    }, {
      actions: {
        onLoad(mir, result) {
          let {data} = result;
          if (!Array.isArray(data)) {
            data = [];
            // return mir.$do.onLoadError(new Error('bad data'));
          }
          mir.$do.setData(data);
          mir.$do.setError(false);
          mir.$do.setLoadState('loaded');
        },
        onLoadError(mir, err) {
          mir.$do.setLoadState('error');
          if (err && err.message) {
            mir.$do.setError(err.message);
          } else {
            mir.$do.setError('load error');
          }
        },
        load(mir) {
          mir.$do.setLoadState('loading');
          axios.get('/api/locations')
            .then(mir.$do.onLoad)
            .catch(mir.$do.onLoadError);
        },
        onLoadLocations(mir, result) {
          mir.$do.setLocations(result.data);
          mir.$do.setLocationsLoadStatus('loaded');
          mir.$do.setLocationsError(false);
        },
        onLoadSourceFileError(err) {
          mir.$do.setLocationsError(err.message);
          mir.$do.setLocationsLoadStatus('error');
        },
        loadLocations(mir) {
          mir.$do.setLocationsLoadStatus('starting');
          axios.get('/api/locations')
            .then(mir.$do.onLoadLocations)
            .catch(mir.$do.onLoadSourceFileError);
        }
      }
    });

    setMir(dataMir);

    dataMir.subscribe(setValues);
    dataMir.$do.load();
    dataMir.$do.loadLocations();

  }, [])


  const {error, locations, showInfoPath} = values;
  return mir ? <Box flex>
    <Heading>Github CSV files</Heading>
    <Paragraph>The root source files</Paragraph>
    {error ? <Text color="status-error">{error}</Text> : ''}
    <LocationsContent mir={mir} {...values} />
  </Box> : '';
}
