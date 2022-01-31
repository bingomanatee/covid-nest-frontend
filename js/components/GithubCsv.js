import {Button, DataTable, Heading, Paragraph, Text} from "grommet";
import React, {useEffect, useMemo, useState} from 'react';
import {Mirror} from '@wonderlandlabs/mirror';
import axios from "axios";
import {TailSpin} from "react-loader-spinner";
import {Checkmark, Close, Github} from "grommet-icons";
import _ from 'lodash';

function makeClick(path) {
  return _.once(
   () => {
    axios.put('/api/github-csv/' + path);
  });
}

function GithubCsvContent({data, error, loadState}) {
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
        render: ({path}) => <Button onClick={makeClick(path)} icon={<Github />} label={'Write to S3'} />
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

export function GithubCsv() {
  const [values, setValues] = useState({});

  useEffect(() => {
    const dataMir = new Mirror({
      data: [],
      loadState: 'start',
      error: ''
    }, {
      actions: {
        onLoad(mir, result) {
          let {data} = result;
          console.log('result: ', result);
          if (!Array.isArray(data.files)) {
            data = {
              files: [
                {path: 'foo', sha: 'fooSha'},
                {path: 'bar', sha: 'barSha'}
              ]
            };
            // return mir.$do.onLoadError(new Error('bad data'));
          }
          mir.$do.setData(data.files);
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
          axios.get('/api/github-csv')
            .then(mir.$do.onLoad)
            .catch(mir.$do.onLoadError);
        }
      }
    });

    dataMir.subscribe(setValues);
    dataMir.$do.load();

  }, [])


  const {error, data, loadState} = values;
  console.log('VALUES:', values);
  return <>
    <Heading>Github CSV files</Heading>
    <Paragraph>The root source files</Paragraph>
    {error ? <Text color="status-error">{error}</Text> : ''}
    <GithubCsvContent {...values} />
  </>;
}