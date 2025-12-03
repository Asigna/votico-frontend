import { Psbt } from 'bitcoinjs-lib';
import { atom } from 'jotai';

import { IUser } from '@types';

interface ILedgerConnect {
  isConnectOpened?: boolean;
  isSignPsbtOpened?: boolean;
  psbtToSign?: Psbt;
  signParams?: {
    users: IUser[];
  };
  onSignSuccess?: (signedTx: string) => void;
  onSignFailed?: () => void;
  safeId?: string;
}

export const ledgerDialogAtom = atom<ILedgerConnect | null>(null);
