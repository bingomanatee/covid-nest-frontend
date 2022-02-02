import {Heading, Paragraph, Text} from "grommet";
import React, {useEffect, useState} from 'react';
import {Mirror} from '@wonderlandlabs/mirror';
import axios from "axios";
import {GithubCsvContent} from "./GithubCsvContent";

export function GithubCsv() {
  const [values, setValues] = useState({});
  const [mir, setMir] = useState(null);

  useEffect(() => {
    const dataMir = new Mirror({
      data: [],
      loadState: 'start',
      error: false,
      sourceFiles: [],
      sourceFilesLoadState: 'start',
      sourceFilesError: false,
      showInfoPath: '',
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
          axios.get('/api/github-csv')
            .then(mir.$do.onLoad)
            .catch(mir.$do.onLoadError);
        },
        onLoadSourceFiles(mir, result) {
          mir.$do.setSourceFiles(result.data);
          mir.$do.setSourceFilesLoadStatus('loaded');
          mir.$do.setSourceFilesError(false);
        },
        onLoadSourceFileError(err) {
          mir.$do.setSourceFilesError(err.message);
          mir.$do.setSourceFilesLoadStatus('error');
        },
        loadSourceFiles(mir) {
          mir.$do.setSourceFilesLoadStatus('starting');
          axios.get('/api/source-files')
            .then(mir.$do.onLoadSourceFiles)
            .catch(mir.$do.onLoadSourceFileError);
        }
      }
    });

    setMir(dataMir);

    dataMir.subscribe(setValues);
    dataMir.$do.load();
    dataMir.$do.loadSourceFiles();

  }, [])


  const {error, data, loadState} = values;
  console.log('VALUES:', values);
  return <>
    <Heading>Github CSV files</Heading>
    <Paragraph>The root source files</Paragraph>
    {error ? <Text color="status-error">{error}</Text> : ''}
    <GithubCsvContent mir={mir} {...values} />
  </>;
}