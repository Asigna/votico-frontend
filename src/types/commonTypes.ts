import { Buffer } from 'buffer';

export const SCREEN_TYPES = {
  MAIN: 'Create transfer inscription',
  CHOOSE_FEE: 'Choose fee',
  REVIEW: 'Review',
  DETAILS: 'Details',
} as const;

export type Rate = 'Fast' | 'Avg' | 'Slow';

export type WalletType =
  | 'XVERSE'
  // | 'HIRO'
  | 'OKX'
  | 'BITGET'
  | 'LEATHER'
  | 'UNISAT'
  | 'PHANTOM'
  | 'SPARROW'
  | 'LEDGER'
  | 'MAGIC_EDEN';

export interface Multisig {
  output: Buffer;
  address: string;
  witness: Buffer[];
  redeem?: {
    output: Buffer;
    redeemVersion: number;
  };
}

export type WalletClass = 'TAPROOT' | 'WSH' | 'HARDWARE_WSH';

export type LedgerConnectErrorType = 'Usb' | 'Disconnect' | 'Locked';

export type OwnersType = { name: string; address: string };
