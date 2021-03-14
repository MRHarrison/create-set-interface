import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import DefineIndexFundPage from './pages/DefineIndexFundPage';
import HomePage from './pages/HomePage';
import LaunchIndexFundPage from './pages/LaunchIndexFundPage';



export default function Routes() {
  const { active } = useWeb3React()

  return (
    <HashRouter>
      <Switch>
        <Route path={ROUTES.HOME} component={HomePage} exact />
        {!active && <Redirect to={ROUTES.HOME} />}
        <Route path={ROUTES.DEFINE} component={DefineIndexFundPage} />
        <Route path={ROUTES.LAUNCH} component={LaunchIndexFundPage} />
        <Route path={ROUTES.INDEX} component={LaunchIndexFundPage} />
      </Switch>
    </HashRouter>
  );
}
