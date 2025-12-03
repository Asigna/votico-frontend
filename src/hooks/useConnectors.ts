import { useEffect, useState } from 'react';
import { useWallets } from '@wallet-standard/react';

import LeatherLogo from '@images/logo/leather.svg';
import LedgerLogo from '@images/logo/ledger.svg';
import XverseLogo from '@images/logo/xverse.svg';
import MagicEdenLogo from '@images/logo/magic-eden.svg';
import OKXLogo from '@images/logo/okx-logo-black-and-white.svg';
import PhantomLogo from '@images/logo/phantom.svg';
import SparrowLogo from '@images/logo/sparrow.png';
import UnisatLogo from '@images/logo/unisatLogo.svg';

import { useTreasuresMulitisigApi } from './useTreasuresMulitisigApi';

export interface Wallet {
  title: string;
  logo: string;
  installed: boolean;
  link: string;
  onConnect: () => Promise<void | { error: string }>;
  isExtension: boolean;
  type: string;
  onClose?: () => void;
}

const useConnectors = () => {
  const [isInstalledXverse, setInstalledXverse] = useState(false);
  const [isInstalledHiro, setInstalledHiro] = useState(false);
  const [isInstalledUnisat, setInstalledUnisat] = useState(false);
  const [isInstalledOKX, setIsInstalledOKX] = useState(false);
  const [, setInstalledBitget] = useState(false);
  const [isInstalledPhantom, setInstalledPhantom] = useState(false);
  const [isInstalledSparrow] = useState(true);
  const [isInstalledLedger] = useState(true);
  const {
    authorizationHIRO,
    xverseAuthRequest,
    authorizationUnisat,
    authorizationOKX,
    authorizationPhantom,
    authorizationLedger,
    magicEdenAuthRequest,
    authorizationSparrow,
  } = useTreasuresMulitisigApi();

  const { wallets } = useWallets();

  useEffect(() => {
    const checkInstalled = () => {
      // TODO_R: [NBOS] need ts to object window.
      setInstalledXverse(!!window.XverseProviders?.BitcoinProvider);
      // TODO_R: [NBOS] need ts to object window.
      // @ts-expect-error: need ts to object window.
      setInstalledHiro(!!window.btc?.request);
      // TODO_R: [NBOS] need ts to object window.
      // @ts-expect-error: need ts to object window.
      setInstalledUnisat(!!window.unisat);
      // TODO_R: [NBOS] need ts to object window.
      // @ts-expect-error: need ts to object window.
      setIsInstalledOKX(typeof window.okxwallet !== 'undefined');
      // TODO_R: [NBOS] need ts to object window.
      // @ts-expect-error: need ts to object window.
      setInstalledBitget(!!(window.bitkeep && window.bitkeep.unisat));
      // TODO_R: [NBOS] need ts to object window.
      // @ts-expect-error: need ts to object window.
      setInstalledPhantom(!!window?.phantom?.bitcoin?.isPhantom);
    };

    checkInstalled();

    const intervalId = setInterval(() => {
      checkInstalled();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return [
    {
      title: 'Xverse',
      logo: XverseLogo,
      installed: isInstalledXverse,
      link: 'https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg',
      onConnect: async () => await xverseAuthRequest(),
      isExtension: true,
      type: 'XVERSE',
      disabled: false,
    },
    {
      title: 'Magic Eden',
      logo: MagicEdenLogo,
      installed:
        Boolean(wallets.some((wallet: { name: string }) => wallet.name === 'Magic Eden')) || false,
      link: 'https://chromewebstore.google.com/detail/magic-eden-wallet/mkpegjkblkkefacfnmkajcjmabijhclg',
      onConnect: async () => await magicEdenAuthRequest(),
      isExtension: true,
      type: 'MAGIC_EDEN',
      disabled: false,
    },
    {
      title: 'Leather',
      logo: LeatherLogo,
      installed: isInstalledHiro,
      link: 'https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
      onConnect: async () => await authorizationHIRO(),
      isExtension: true,
      type: 'LEATHER',
      disabled: false,
    },
    {
      title: 'OKX',
      logo: OKXLogo,
      installed: isInstalledOKX,
      link: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
      onConnect: async () => await authorizationOKX(),
      isExtension: true,
      type: 'OKX',
      disabled: false,
    },
    {
      title: 'Phantom',
      logo: PhantomLogo,
      installed: isInstalledPhantom,
      link: 'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
      onConnect: async () => await authorizationPhantom(),
      isExtension: true,
      type: 'PHANTOM',
      disabled: false,
    },
    {
      title: 'UniSat',
      logo: UnisatLogo,
      installed: isInstalledUnisat,
      link: 'https://chrome.google.com/webstore/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo',
      onConnect: async () => await authorizationUnisat(),
      isExtension: true,
      type: 'UNISAT',
      disabled: false,
    },
    // {
    //   title: 'Bitget',
    //   logo: BitgetLogo,
    //   installed: isInstalledBitget,
    //   link: 'https://chromewebstore.google.com/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak',
    //   onConnect: async () => await authorizationBitget(),
    //   isExtension: true,
    //   type: 'BITGET',
    // },
    {
      title: 'Ledger',
      logo: LedgerLogo,
      installed: isInstalledLedger,
      link: '',
      onConnect: async () => await authorizationLedger(),
      isExtension: false,
      type: 'LEDGER',
      disabled: false,
    },
    {
      title: 'Sparrow',
      logo: SparrowLogo,
      installed: isInstalledSparrow,
      link: '',
      onConnect: async () => await authorizationSparrow(),
      isExtension: false,
      type: 'SPARROW',
      disabled: true,
    },
  ];
};

export default useConnectors;
