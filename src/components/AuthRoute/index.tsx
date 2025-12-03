import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Connect } from '@pages';

export const AuthRoute: React.FC = React.memo(() => {
  const { address, onLogin } = useOutletContext<{ address: string; onLogin: () => void }>();

  if (!address) {
    return <Connect />;
  }

  return <Outlet context={{ onLogin, address }} />;
});
