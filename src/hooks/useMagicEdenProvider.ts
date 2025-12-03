import { useWallets } from '@wallet-standard/react';

const SatsConnectNamespace = 'sats-connect:';

export const useMagicEdenWalletProvider = () => {
  const { wallets } = useWallets();
  const magicEdenWallet = wallets.find((wallet) => wallet.name === 'Magic Eden');
  // @ts-expect-error correct type
  const magicEdenWalletProvider = magicEdenWallet?.features[SatsConnectNamespace].provider;

  return magicEdenWalletProvider;
};
