import {Box, Heading, Paragraph, Text} from "grommet";
import React, {useEffect, useState} from 'react';
import {Mirror} from '@wonderlandlabs/mirror';
import axios from "axios";
import {LocationsContent} from "./LocationsContent";
import _ from 'lodash';

export function Locations() {
  const [values, setValues] = useState({});
  const [mir, setMir] = useState(null);

  useEffect(() => {
    const dataMir = new Mirror({
      loadState: 'start',
      error: false,
      locations: [],
      stateSearchString: '',
      showInfoPath: '',
    }, {
      selectors: {
        states ({locations, stateSearchString}) {
          return _(locations).map('province_state').uniq().sortBy().value();
        }
      },
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
        onLoadLocations(mir, result) {
          mir.$do.setLocations(result.data);
          mir.$do.setLoadState('loaded');
          mir.$do.setLocationsError(false);
        },
        onLoadSourceFileError(err) {
          mir.$do.setLocationsError(err.message);
          mir.$do.setLocationsLoadStatus('error');
        },
        loadLocations(mir) {
          mir.$do.setLoadState('start');
          axios.get('/api/locations')
            .then(mir.$do.onLoadLocations)
            .catch(mir.$do.onLoadError);
        }
      }
    });

    setMir(dataMir);

    dataMir.subscribe(setValues);
    dataMir.$do.loadLocations();

  }, [])


  const {error} = values;
  return mir ? <Box flex>
    <Heading>Locations</Heading>
    <Paragraph>Aggregate locations for data (in US)</Paragraph>
    {error ? <Text color="status-error">{error}</Text> : ''}
    <LocationsContent mir={mir} {...values} />
  </Box> : '';
}
