import React from 'react';
import ReactDOM from 'react-dom';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Web3ReactManager from './components/Web3ReactManager';
import store from './state';


function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>
      </Web3ReactManager>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

