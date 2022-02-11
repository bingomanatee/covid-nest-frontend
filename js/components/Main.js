import React, {} from 'react';
import {Box, Grommet, Main} from 'grommet';
import theme from './../../theme.json';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Intro} from "./Intro";
import {GithubCsv} from "./GithubCsv";
import {Locations} from './Locations';
import {SiteHeader} from "./SiteHeader";


export default () => {
  return (
    <BrowserRouter>
      <Grommet theme={theme} style={{height: '100%'}}>
        <Main style={{height: '100%'}}>
          <SiteHeader />
          <Box fill style={{overflowY: 'scroll'}} pad="medium">

          <Routes>
            <Route path="/" element={<Intro/>}>
            </Route>
            <Route path="/locations" element={<Locations/>}>
            </Route>
            <Route path="/github-csv" element={<GithubCsv/>}/>
            <Route path="*" element={<Intro />} />
          </Routes>
        </Box>
        </Main>
      </Grommet>
    </BrowserRouter>
  )
};
