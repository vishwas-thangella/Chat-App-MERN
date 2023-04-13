import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store } from './redux/Store';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={Store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

