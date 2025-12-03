import * as ecc from '@bitcoinerlab/secp256k1';
import { BIP32Factory } from 'bip32';
import { AddressType } from 'bitcoin-address-validation';
import * as bitcoin from 'bitcoinjs-lib';
import { Network, networks } from 'bitcoinjs-lib';
import BitcoinApp from 'ledger-bitcoin';
import { NetworkModes } from './bitcoin-ledger-utils';

export type WalletScriptType = 'Legacy' | 'Nested Segwit' | 'Native Segwit' | 'Taproot';

export interface IAddressSelection {
  xpub: string;
  derivationPath: string;
  publicKey: string;
  address: string;
}

const bip32 = BIP32Factory(ecc);

interface PullBitcoinKeysFromLedgerDeviceArgs {
  onRequestKey?(keyIndex: number): void;
  network: NetworkModes;
}

function getPublicKeyFromXpubAtIndex(xpub: string, index: number, network: string): Buffer {
  const btcNetwork = network === 'mainnet' ? networks.bitcoin : networks.testnet;
  const { publicKey } = bip32.fromBase58(xpub, btcNetwork).derivePath(`0/${index}`);

  return publicKey;
}

const getCoinType = (network: NetworkModes) => (network === 'mainnet' ? 0 : 1);

async function importNativeSegwitAccountFromLedger({
  extendedPublicKey,
  network,
  addressIndex,
  addressType,
}: {
  extendedPublicKey: string;
  network: NetworkModes;
  addressIndex: number;
  addressType: AddressType;
}): Promise<{ address: string; publicKey: string }> {
  const publicKey = getPublicKeyFromXpubAtIndex(extendedPublicKey, addressIndex, network).toString(
    'hex'
  );
  const net = network === 'mainnet' ? networks.bitcoin : networks.testnet;

  const address = publicKeyToAddress(publicKey, addressType, net);

  return { address, publicKey: publicKey };
}

function publicKeyToAddress(publicKey: string, type: AddressType, network: Network) {
  if (!publicKey) return '';
  const pubkey = Buffer.from(publicKey, 'hex');
  if (type === AddressType.p2pkh) {
    const { address } = bitcoin.payments.p2pkh({
      pubkey,
      network,
    });

    return address || '';
  } else if (type === AddressType.p2wpkh) {
    const { address } = bitcoin.payments.p2wpkh({
      pubkey,
      network,
    });

    return address || '';
  } else if (type === AddressType.p2tr) {
    const { address } = bitcoin.payments.p2tr({
      internalPubkey: pubkey.length === 32 ? pubkey : pubkey.slice(1, 33),
      network,
    });

    return address || '';
  } else if (type === AddressType.p2sh) {
    const { address } = bitcoin.payments.p2sh({
      pubkey: pubkey,
      network,
      redeem: bitcoin.payments.p2wpkh({ pubkey: pubkey, network }),
    });

    return address || '';
  } else {
    return '';
  }
}

export function pullBitcoinKeysFromLedgerDevice(
  app: BitcoinApp,
  derivationPath: string,
  addressType: AddressType
) {
  return async ({ onRequestKey, network }: PullBitcoinKeysFromLedgerDeviceArgs) => {
    const amountOfKeysToExtractFromDevice = 10;
    const btcNetwork = getCoinType(network);
    const keys: IAddressSelection[] = [];
    for (let accountIndex = 0; accountIndex < amountOfKeysToExtractFromDevice; accountIndex++) {
      const xpubDerivationPath = `${derivationPath}${btcNetwork}'/${accountIndex}'`;
      const extendedPublicKey = await app.getExtendedPubkey(xpubDerivationPath);
      onRequestKey?.(accountIndex);
      const { publicKey, address } = await importNativeSegwitAccountFromLedger({
        extendedPublicKey,
        network,
        addressIndex: 0,
        addressType,
      });

      const fullDerivationPath = `${xpubDerivationPath}/0/0`;
      keys.push({
        publicKey,
        address,
        xpub: extendedPublicKey,
        derivationPath: fullDerivationPath,
      });
    }

    return { status: 'success', keys };
  };
}
