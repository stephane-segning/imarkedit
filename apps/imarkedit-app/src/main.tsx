import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { IoProvider } from 'socket.io-react-hook';
import 'moment-timezone';

import App from './app/app';
import { StorageServiceProvider } from './app/services/storage/provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <StorageServiceProvider>
      <IoProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </IoProvider>
    </StorageServiceProvider>
  </StrictMode>
);
