import { atom, useAtom } from 'jotai';

import { atomWithStorage } from '@utils';
import { useEffect } from 'react';
import { getStorageKeysForNetwork } from '../hooks';

// TODO_R: [NBOS] state to single file
const addressAtom = atom('');

export const useAddress = () => {
  const [address, setAddress] = useAtom(addressAtom);
  const { network } = useNetwork();

  useEffect(() => {
    const localStorageAddress = localStorage.getItem(
      getStorageKeysForNetwork(network).voticoWalletId
    );
    setAddress(localStorageAddress || '');
  }, [network, setAddress]);

  return {
    address,
    setAddress,
  };
};

const NETWORK_STATE_KEY = 'network';
const networkAtom = atomWithStorage(NETWORK_STATE_KEY, 'mainnet');

export const useNetwork = () => {
  const [network, setNetwork] = useAtom(networkAtom);

  return {
    network,
    setNetwork,
  };
};
