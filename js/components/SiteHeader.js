import {Button, Header, Text} from "grommet";
import {useLinkClickHandler} from "react-router-dom";
import React, {useMemo} from "react";
import {Home, Github} from 'grommet-icons';

export function SiteHeader() {
  let handleClickGithub = useLinkClickHandler('/github-csv', {});

  const onClickGithub = useMemo(() => {
    return (event) => {
      event.preventDefault();
      handleClickGithub(event);
    }
  }, []);


  let handleClickHome = useLinkClickHandler('/', {});

  const onClickHome = useMemo(() => {
    return (event) => {
      event.preventDefault();
      handleClickHome(event);
    }
  }, []);

  return <Header background="brand" justify="start">
    <Button onClick={onClickHome} icon={<Home color="white"/>} hoverIndicator/>
    <Button onClick={onClickGithub} icon={<Github color="white"></Github>}
            label={<Text size="small" color="white">Source Files</Text>}></Button>
  </Header>;
}