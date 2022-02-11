import {Button, Header, Text} from "grommet";
import {useLinkClickHandler} from "react-router-dom";
import React, {useMemo} from "react";
import {Home, Github, Location} from 'grommet-icons';

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

  let handleClickLocation = useLinkClickHandler('/locations', {});

  const onClickLocation = useMemo(() => {
    return (event) => {
      event.preventDefault();
      handleClickLocation(event);
    }
  }, []);

  return <Header background="brand" justify="start">
    <Button onClick={onClickHome} icon={<Home color="white"/>} hoverIndicator/>
    <Button onClick={onClickGithub} icon={<Github color="white"></Github>}
      label={<Text size="small" color="white">Source Files</Text>}></Button>
    <Button onClick={onClickLocation} icon={<Location color="white"></Location>}
      label={<Text size="small" color="white">Source Files</Text>}></Button>
  </Header>;
}
