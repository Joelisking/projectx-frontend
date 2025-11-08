'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { reduxStore, reduxPersistor } from './redux/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={reduxPersistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}