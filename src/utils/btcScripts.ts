import { Network, validate } from 'bitcoin-address-validation';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';

bitcoin.initEccLib(ecc);

export const validateBtcAddress = (address: string, network: string) => {
  return validate(address, network === 'testnet' ? Network.testnet : Network.mainnet);
};
