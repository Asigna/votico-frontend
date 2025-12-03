import Transport from '@ledgerhq/hw-transport-webusb';
import { Psbt } from 'bitcoinjs-lib';
import BitcoinApp, { WalletPolicy } from 'ledger-bitcoin';
import { PartialSignature } from 'ledger-bitcoin/build/main/lib/appClient';
const networkModes = ['mainnet', 'testnet'] as const;
export type NetworkModes = (typeof networkModes)[number];

type BitcoinTestnetModes = 'testnet' | 'regtest' | 'signet';

export type BitcoinNetworkModes = NetworkModes | BitcoinTestnetModes;

export async function connectLedgerBitcoinApp() {
  const transport = await Transport.create();

  return new BitcoinApp(transport);
}

export async function getBitcoinAppVersion(app: BitcoinApp) {
  return app.getAppAndVersion();
}

const bitcoinNetworkToCoreNetworkMap: Record<BitcoinNetworkModes, NetworkModes> = {
  mainnet: 'mainnet',
  testnet: 'testnet',
  regtest: 'testnet',
  signet: 'testnet',
};
export function bitcoinNetworkModeToCoreNetworkMode(mode: BitcoinNetworkModes) {
  return bitcoinNetworkToCoreNetworkMap[mode];
}

export function signLedgerTransaction(app: BitcoinApp) {
  return async (psbt: string, walletPolicy: WalletPolicy, policyHmac: Buffer | null) =>
    app.signPsbt(psbt, walletPolicy, policyHmac);
}

export function signLedgerMessage(app: BitcoinApp) {
  return async (payload: Buffer, path: string) => app.signMessage(payload, path);
}

export function signTransactionWithSignature(
  psbt: Psbt,
  publicKey: string,
  signatures: [number, PartialSignature][]
) {
  const signaturesForPubKey = signatures.filter((s) => s[1].pubkey.toString('hex') === publicKey);
  if (!signaturesForPubKey) {
    throw new Error('Public key not found');
  }
  signaturesForPubKey.forEach((s) => {
    psbt.updateInput(s[0], {
      partialSig: [s[1]],
    });
  });

  return psbt;
}

export const extractFirstThreeSections = (derivationPath?: string) => {
  if (!derivationPath) {
    return '';
  }
  const regex = /^(m\/\d+'\/\d+'\/\d+')/;
  const match = derivationPath.match(regex);

  return match ? match[1] : '';
};
