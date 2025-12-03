import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { WalletStandardProvider } from '@wallet-standard/react';

import { router } from './utils/router.tsx';

const App: React.FC = () => {
  return (
    <WalletStandardProvider>
      <RouterProvider router={router} />
    </WalletStandardProvider>
  );
};

export default App;
