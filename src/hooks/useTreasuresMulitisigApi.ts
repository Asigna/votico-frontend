import { useEffect, useMemo } from 'react';
import { networks } from 'bitcoinjs-lib';
import { atom, useAtom } from 'jotai';
import { AddressPurpose, BitcoinNetworkType, getAddress, signMessage } from 'sats-connect';

import { bitcoinLogin, createCustomMessageSignature, getAllMyContacts } from '@api/auth';
import {
  AddressesResponseType,
  AddressesType,
  IMultiSignWallet,
  SatsResponseType,
  WalletType,
} from '@types';
import { validateBtcAddress } from '@utils';
import { ledgerDialogAtom, sparrowDialogAtom, useAddress, useContacts, useNetwork } from '@store';

import { useMagicEdenWalletProvider } from './useMagicEdenProvider';

const extractAccountNumber = (path: string) => {
  const segments = path.split('/');
  const accountNum = parseInt(segments[3].replace(/'/g, ''), 10);
  if (isNaN(accountNum)) throw new Error('Cannot parse account number from path');

  return accountNum;
};

export const getStorageKeysForNetwork = (network: string) => {
  const isMainnet = network === 'mainnet';
  const walletType = isMainnet ? 'wallet-type-mainnet' : 'wallet-type';
  const ownerPk = isMainnet ? 'owner-pk-mainnet' : 'owner-pk';
  const voticoWalletId = isMainnet ? 'votico-walletId-mainnet' : 'votico-walletId';
  const voticoToken = isMainnet ? 'votico-token-mainnet' : 'votico-token';
  const voticoRefresh = isMainnet ? 'votico-refresh-mainnet' : 'votico-refresh';
  const connectedAccountNumber = 'connected-account-number';
  const walletClass = 'wallet-class';
  const hardwarePolicyHmac = 'hardware-policy-hmac';

  return {
    walletClass,
    walletType,
    ownerPk,
    voticoWalletId,
    voticoToken,
    voticoRefresh,
    hardwarePolicyHmac,
    connectedAccountNumber,
  };
};

export const useNetworkObj = () => {
  const { network } = useNetwork();

  return useMemo(() => {
    if (network === 'mainnet') return networks.bitcoin;

    return networks.testnet;
  }, [network]);
};

const isMainnetAddress = (address: string) => validateBtcAddress(address, 'mainnet');
const isTestnetAddress = (address: string) => validateBtcAddress(address, 'testnet');
export const currentSafeAtom = atom<IMultiSignWallet | undefined>(undefined);

export const useTreasuresMulitisigApi = () => {
  const { address, setAddress } = useAddress();
  const { setContacts } = useContacts();
  const { network } = useNetwork();
  const [, setSparrowDialog] = useAtom(sparrowDialogAtom);
  const [currentSafe] = useAtom(currentSafeAtom);
  const [, setLedgerDialog] = useAtom(ledgerDialogAtom);

  const magicEdenWalletProvider = useMagicEdenWalletProvider();
  const xverseWalletProvider = window.XverseProviders?.BitcoinProvider;

  const finalizeAuth = async (
    walletType: WalletType,
    publicKey: string,
    address: string,
    signature: string
  ) => {
    await bitcoinLogin({
      signature,
      address,
      publicKey,
      network,
      walletType,
      // }).then((res) => console.log('bLogin', res));
    });
    const storageKeys = getStorageKeysForNetwork(network);
    // TODO_Y: add type safe generic localStorage methods wrappers for general use.
    // TODO_Y: add hooks for walletType localStorage management with type safe method wrappers
    localStorage.setItem(storageKeys.walletType, walletType);
    localStorage.setItem(storageKeys.ownerPk, publicKey);
    setAddress(address);

    window.location.href = '/';
  };

  useEffect(() => {
    const storageKeys = getStorageKeysForNetwork(network);
    setAddress(localStorage.getItem(storageKeys.voticoWalletId) ?? '');
  }, [network, setAddress]);

  const getContacts = async () => {
    try {
      const contactsList = await getAllMyContacts();
      setContacts(contactsList.data);
    } catch (error) {
      console.error('Fetching contacts error:', error);
    }
  };

  const signCustomMessage = async (message: string) => {
    const netType = network === 'testnet' ? BitcoinNetworkType.Testnet : BitcoinNetworkType.Mainnet;
    const storageKeys = getStorageKeysForNetwork(network);
    const provider = localStorage.getItem(storageKeys.walletType);

    switch (provider) {
      case 'XVERSE':
      case 'MAGIC_EDEN':
        return await signMessage({
          onFinish: async (response) => {
            await createCustomMessageSignature({
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              multiSig: currentSafe.address,
              message: message,
              signature: response,
            });
          },
          onCancel: () => {
            return;
          },
          payload: {
            address: address,
            message: message,
            network: {
              type: netType,
            },
          },
          getProvider: () => {
            return provider === 'XVERSE' ? xverseWalletProvider : magicEdenWalletProvider;
          },
        });
      case 'LEATHER':
        // @ts-expect-error: need ts to object window
        // eslint-disable-next-line no-case-declarations
        const hiroResponse = await window.btc.request('signMessage', {
          message: message,
          paymentType: 'p2tr', // or 'p2wphk' (default)
          network,
        });

        return await createCustomMessageSignature({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multiSig: currentSafe.address,
          message: message,
          signature: hiroResponse.result.signature,
        });
      case 'UNISAT':
        // @ts-expect-error: need ts to object window
        // eslint-disable-next-line no-case-declarations
        const unisatResponse = window.unisat.signMessage(message);

        return await createCustomMessageSignature({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multiSig: currentSafe.address,
          message: message,
          signature: unisatResponse,
        });

      case 'OKX':
        // @ts-expect-error: need ts to object window
        // eslint-disable-next-line no-case-declarations
        const signature: string = await okxwallet.bitcoin.signMessage(message, {
          from: address,
        });

        return await createCustomMessageSignature({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multiSig: currentSafe.address,
          message: message,
          signature,
        });

      case 'BITGET':
        // @ts-expect-error: need ts to object window
        // eslint-disable-next-line no-case-declarations
        const bitgetSignature: string = await window.bitkeep.unisat.signMessage(message);

        return await createCustomMessageSignature({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multiSig: currentSafe.address,
          message: message,
          signature: bitgetSignature,
        });

      case 'PHANTOM':
        // @ts-expect-error: need ts to object window
        // eslint-disable-next-line no-case-declarations
        const phantomSignature: string = await window.phantom.bitcoin.signMessage(message);

        return await createCustomMessageSignature({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multiSig: currentSafe.address,
          message: message,
          signature: phantomSignature,
        });
    }
  };

  const magicEdenAuthRequest = async () => {
    const netType = network === 'testnet' ? BitcoinNetworkType.Testnet : BitcoinNetworkType.Mainnet;
    if (network === 'testnet') return { error: 'network mismatch' };
    const getAddressOptions = {
      payload: {
        purposes: [AddressPurpose.Ordinals],
        message: 'Multisig owner address',
        network: {
          type: netType,
        },
      },
      getProvider: () => magicEdenWalletProvider,
      onFinish: async (response: AddressesResponseType) => {
        const addr = response.addresses.find(
          (a: SatsResponseType) => a.purpose === AddressPurpose.Ordinals
        );
        const ownerPK = addr?.publicKey || '';
        const ownerAddress = addr?.address || '';
        const storageKeys = getStorageKeysForNetwork(network);
        localStorage.setItem(storageKeys.voticoWalletId, ownerAddress);
        await signMessage({
          onFinish: async (response) => {
            const signature = response;
            await finalizeAuth('MAGIC_EDEN', ownerPK, ownerAddress, signature);
          },
          onCancel: () => {
            return;
          },
          payload: {
            address: ownerAddress,
            message: 'Hello Votico!',
            network: {
              type: netType,
            },
          },
          getProvider: () => magicEdenWalletProvider,
        });
      },
      onCancel: () => {
        return;
      },
    };
    await getAddress(getAddressOptions);
  };

  const xverseAuthRequest = async () => {
    const netType = network === 'testnet' ? BitcoinNetworkType.Testnet : BitcoinNetworkType.Mainnet;
    const getAddressOptions = {
      payload: {
        purposes: [AddressPurpose.Ordinals],
        message: 'Multisig owner address',
        network: {
          type: netType,
        },
      },
      getProvider: async () => xverseWalletProvider,
      onFinish: async (response: AddressesResponseType) => {
        const addr = response.addresses.find(
          (a: SatsResponseType) => a.purpose === AddressPurpose.Ordinals
        );
        const ownerPK = addr?.publicKey || '';
        const ownerAddress = addr?.address || '';
        const storageKeys = getStorageKeysForNetwork(network);
        localStorage.setItem(storageKeys.voticoWalletId, ownerAddress);
        await signMessage({
          onFinish: async (response) => {
            const signature = response;
            await finalizeAuth('XVERSE', ownerPK, ownerAddress, signature);
          },
          onCancel: () => {
            return;
          },
          payload: {
            address: ownerAddress,
            message: 'Hello Votico!',
            network: {
              type: netType,
            },
          },
          getProvider: async () => xverseWalletProvider,
        });
      },
      onCancel: () => {
        return;
      },
    };

    await getAddress(getAddressOptions);
  };

  // TODO_R: [NBOS] ts window.btc, remove @ts-expect-error
  const authorizationBitget = async () => {
    const storageKeys = getStorageKeysForNetwork(network);
    const requestAccount = async () => {
      // @ts-expect-error: need ts to object window
      const result: string[] = await bitkeep.unisat.requestAccounts();
      // @ts-expect-error: need ts to object window
      const publicKey = await bitkeep.unisat.getPublicKey();

      return { address: result[0], publicKey };
    };

    let account = await requestAccount();
    if (network === 'testnet' && !isTestnetAddress(account.address)) {
      // @ts-expect-error: need ts to object window
      const res = await bitkeep.unisat.switchNetwork('testnet');
      account = await requestAccount();
      if (res !== 'testnet') {
        return { error: 'network mismatch' };
      }
    }
    if (network === 'mainnet' && !isMainnetAddress(account.address)) {
      // @ts-expect-error: need ts to object window
      const res = await bitkeep.unisat.switchNetwork('livenet');
      account = await requestAccount();
      if (res !== 'livenet') {
        return { error: 'network mismatch' };
      }
    }
    localStorage.setItem(storageKeys.voticoWalletId, account.address);
    // @ts-expect-error: need ts to object window
    const signature: string = await bitkeep.unisat.signMessage('Hello Votico!');
    await finalizeAuth('BITGET', account.publicKey, account.address, signature);
  };

  // TODO_R: [NBOS] ts window.btc, remove @ts-expect-error
  const authorizationOKX = async () => {
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
    const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
    const isMobile = isIOS || isAndroid;
    const isOKXApp = /OKApp/i.test(ua);
    if (isMobile && !isOKXApp) {
      const encodedUrl =
        'https://www.okx.com/download?deeplink=' +
        encodeURIComponent(
          'okx://wallet/dapp/url?dappUrl=' + encodeURIComponent(window.location.href)
        );
      window.location.href = encodedUrl;

      return;
    }
    const storageKeys = getStorageKeysForNetwork(network);
    // @ts-expect-error: need ts to object window
    const result: { publicKey: string; address: string } = await okxwallet.bitcoin.connect();
    const ownerAddress = result.address;
    // @ts-expect-error: need ts to object window
    const ownerPK = await okxwallet.bitcoin.getPublicKey();
    if (network === 'testnet' ? !isTestnetAddress(ownerAddress) : !isMainnetAddress(ownerAddress)) {
      return { error: 'network mismatch' };
    }
    localStorage.setItem(storageKeys.voticoWalletId, ownerAddress);
    // @ts-expect-error: need ts to object window
    const signature: string = await okxwallet.bitcoin.signMessage('Hello Votico!', {
      from: ownerAddress,
    });
    await finalizeAuth('OKX', ownerPK, ownerAddress, signature);
  };

  const authorizationPhantom = async () => {
    if (network === 'testnet') return { error: 'network mismatch' };

    try {
      // @ts-expect-error: need ts to object window
      if (!window.phantom?.bitcoin?.isPhantom) {
        throw new Error('Phantom Bitcoin not detected');
      }

      // @ts-expect-error: need ts to object window
      const accounts = await window.phantom.bitcoin.requestAccounts();

      if (!accounts || !accounts.length) {
        throw new Error('No Bitcoin accounts returned');
      }

      console.log('Phantom BTC accounts:', accounts);

      const addresses: {
        address: string;
        publicKey: string;
        addressType: string;
        purpose: string;
        tweakedPublicKey?: string;
      }[] = accounts;
      // @ ts-expect-error: need ts to object window
      // await window.phantom.bitcoin.requestAccounts();
      const storageKeys = getStorageKeysForNetwork(network);
      // const addressResult = addresses.find((address) => address.addressType === 'p2tr');
      const addressResult = addresses.find((address) => address.purpose === 'ordinals');
      const ownerPublickKey = addressResult?.tweakedPublicKey || addressResult?.publicKey;
      const ownerAddress = addressResult?.address;
      if (!ownerPublickKey || !ownerAddress) throw new Error('not valid request accounts');
      localStorage.setItem(storageKeys.voticoWalletId, ownerAddress);
      const signatureResponse: { signedMessage: Uint8Array; signature: Uint8Array } =
        // @ts-expect-error: need ts to object window
        await window.phantom.bitcoin.signMessage(
          ownerAddress,
          new TextEncoder().encode('Hello Votico!')
        );
      const signature = Buffer.from(signatureResponse.signature).toString('base64');
      await finalizeAuth('PHANTOM', ownerPublickKey, ownerAddress, signature);
    } catch (e) {
      console.error('Phantom Bitcoin error:', e);
    }
  };

  // TODO_R: [NBOS] ts window.btc, remove @ts-expect-error
  const authorizationHIRO = async () => {
    const storageKeys = getStorageKeysForNetwork(network);
    // @ts-expect-error: need ts to object window
    const userAddresses = await window.btc?.request('getAddresses');
    // console.log('LEATHER userAddresses:', userAddresses);
    const addressSafeOwner = userAddresses?.result?.addresses?.find(
      // TODO_R: check after ts window
      (a: AddressesType) => a.type === 'p2tr'
    );
    if (!addressSafeOwner) {
      console.error('no address safe owner');

      return;
    }
    const ownerPK = addressSafeOwner.tweakedPublicKey || addressSafeOwner.publicKey;
    const ownerAddress = addressSafeOwner.address;
    const accounNumber = extractAccountNumber(addressSafeOwner.derivationPath);
    if (network === 'testnet' ? !isTestnetAddress(ownerAddress) : !isMainnetAddress(ownerAddress)) {
      return { error: 'network mismatch' };
    }
    localStorage.setItem(storageKeys.voticoWalletId, ownerAddress);
    // @ts-expect-error: need ts to object window
    const response = await window.btc.request('signMessage', {
      message: 'Hello Votico!',
      paymentType: 'p2tr', // or 'p2wphk' (default)
      network,
    });

    await finalizeAuth('LEATHER', ownerPK, ownerAddress, response.result.signature);
    localStorage.setItem(storageKeys.connectedAccountNumber, accounNumber.toString());
  };

  // TODO_R: [NBOS] ts window.btc, remove @ts-expect-error
  const authorizationUnisat = async () => {
    try {
      const net = network;
      const storageKeys = getStorageKeysForNetwork(net);
      // @ts-expect-error: need ts to object window
      const accounts = await window.unisat.getAccounts();
      await new Promise((r) => setTimeout(r, 500));
      if (!accounts || !accounts.length) {
        // @ts-expect-error: need ts to object window
        await window.unisat.requestAccounts();
      }
      // @ts-expect-error: need ts to object window
      const ownerAddress = (await window.unisat.getAccounts())[0];
      // @ts-expect-error: need ts to object window
      const ownerPK = await window.unisat.getPublicKey();
      // @ts-expect-error: need ts to object window
      const walletNetwork = await window.unisat.getNetwork();
      if (net === 'testnet' ? walletNetwork !== 'testnet' : walletNetwork !== 'livenet') {
        return { error: 'network mismatch' };
      }

      localStorage.setItem(storageKeys.voticoWalletId, ownerAddress);
      // @ts-expect-error: need ts to object window
      const response = await window.unisat.signMessage('Hello Votico!');
      await finalizeAuth('UNISAT', ownerPK, ownerAddress, response);
    } catch (e) {
      console.error(e);
    }
  };

  const authorizationLedger = async () => {
    setLedgerDialog({ isConnectOpened: true });
  };
  const authorizationSparrow = async () => {
    setSparrowDialog({ isConnectOpened: true });
  };

  return {
    xverseAuthRequest,
    getContacts,
    authorizationHIRO,
    authorizationUnisat,
    authorizationOKX,
    authorizationBitget,
    authorizationPhantom,
    authorizationLedger,
    authorizationSparrow,
    signCustomMessage,
    magicEdenAuthRequest,
  };
};
