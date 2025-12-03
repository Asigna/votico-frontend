import React from 'react';
import { useAtom } from 'jotai';
import { ledgerDialogAtom } from '../../store';
import { Modal } from '../../kit';
import LedgerConnectDialog from './LedgerConnectDialog';
import LedgerSignDialog from './LedgerSignDialog';

export const GlobalDialogs: React.FC = () => {
  const [ledgerDialog, setLedgerDialog] = useAtom(ledgerDialogAtom);

  return (
    <>
      <Modal onClose={() => setLedgerDialog({})} isShow={ledgerDialog?.isConnectOpened || false}>
        <LedgerConnectDialog onClose={() => setLedgerDialog({})} />
      </Modal>
      <Modal onClose={() => setLedgerDialog({})} isShow={ledgerDialog?.isSignPsbtOpened || false}>
        <LedgerSignDialog safeId="" onSuccess={(val) => console.log(val)} />
      </Modal>
    </>
  );
};
