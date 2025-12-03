import React, { useState } from 'react';
import cx from 'classnames';
import { Outlet } from 'react-router-dom';

import { Modal } from '@kit';
import { ConnectWalletModal, WrongNetworkPopup, Header, GlobalDialogs } from '@components';

import s from './index.module.scss';
import { ledgerDialogAtom, useAddress } from '@store';
import { useAtom } from 'jotai';

export const Layout = React.memo(() => {
  const [isShowConnectors, setIsShowConnectors] = useState(false);
  const [ledgerDialog] = useAtom(ledgerDialogAtom);
  const { address } = useAddress();

  return (
    <main
      className={cx(
        s.container,
        'flex min-h-screen flex-col items-center gap-20 px-16 sm:px-24 pb-24 bg-black relative pt-100'
      )}
    >
      <Header onLogin={() => setIsShowConnectors(true)} address={address} />
      <WrongNetworkPopup />
      {!ledgerDialog?.isConnectOpened && (
        <Modal onClose={() => setIsShowConnectors(false)} isShow={isShowConnectors}>
          <ConnectWalletModal />
        </Modal>
      )}
      <GlobalDialogs />
      <Outlet context={{ onLogin: () => setIsShowConnectors(true), address }} />
    </main>
  );
});
