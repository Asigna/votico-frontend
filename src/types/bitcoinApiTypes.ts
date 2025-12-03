import { WalletClass, WalletType } from '@types';

export interface ContactsResponse {
  success: boolean;
  data: IContact[];
}

export interface IContact {
  _id?: string;
  wallet_address: string;
  contact_name: string;
  contact_address: string;
  update_time?: Date;
}

export type BtcChain = 'btc:devnet' | 'btc:testnet' | 'btc:localnet' | 'btc:mainnet';

export type MultisigType = 'WSH' | 'HARDWARE_WSH' | 'TAPROOT';

interface ICreateOwner {
  userId: string;
}

interface IOwner extends ICreateOwner {
  address: string;
}

interface ICreateMultiSignWallet {
  name: string;
  threshold: number;
  owners: ICreateOwner[];
  creatorId: string;
  creatorAddress: string;
  network: BtcChain;
  output: string;
  witness: string[];
}

interface IBaseMultiSignWallet extends ICreateMultiSignWallet {
  owners: IOwner[];
  claimId: string;
  address: string;
  create_time: Date;
  update_time: Date;
  multiSigType: MultisigType;
}

type MultisignWallet = IBaseMultiSignWallet & {
  output: string;
  address: string;
  witness: string[];
  redeem: {
    output: string;
    redeemVersion: number;
  };
};

export interface IMultiSignWallet extends MultisignWallet {
  _id: string;
}

export const CURRENT_XVERSE_NETWORK: BtcChain = 'btc:testnet';

export type SatsResponseType = {
  address: string;
  publicKey: string;
  purpose: string;
};

export interface AddressesResponseType {
  addresses: SatsResponseType[];
}

export interface AddressesType {
  type: string;
}

export interface ICreateUserSignature {
  multiSig: string;
  message: string;
  signature: string;
}

interface IBaseUser {
  address: string;
  publicKey?: string;
  xPub?: string;
  fingerPrint?: string;
  derivation?: string;
  walletType: WalletType;
  walletClass: WalletClass;
}

export interface IUser extends IBaseUser {
  _id: string;
}

export interface GetMultisigUsersResponse {
  success: boolean;
  data: IUser[];
}
export interface IMember {
  userId: string;
  projectId: string;
  date: string;
  type: string;
  _id: string;
  __v: string;
}
export interface MemberResponse {
  success: boolean;
  data: IMember;
}
