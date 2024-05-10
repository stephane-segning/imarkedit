import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import 'moment-timezone';

import App from './app/app';
import { StorageServiceProvider } from './app/services/storage/provider';
import { SWRProvider } from './app/services/swr';
import { AuthProvider } from './app/services/auth';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <StorageServiceProvider>
      <AuthProvider>
        <SWRProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </SWRProvider>
      </AuthProvider>
    </StorageServiceProvider>
  </StrictMode>
);
