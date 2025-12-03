import { atom, useAtom } from 'jotai';

import { WalletType } from '@types';

interface IWalletData {
  publicKey: string;
  type: WalletType;
}

const walletDataAtom = atom<IWalletData | undefined>(undefined);

export const useWalletData = () => {
  const [walletData, setWalletData] = useAtom(walletDataAtom);

  return {
    walletData,
    setWalletData,
  };
};
