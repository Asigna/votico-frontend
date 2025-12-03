/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '@wallet-standard/react' {
  import { ReactElement } from 'react';
  export const useWallets: () => {
    wallets: { name: string }[];
  };
  export const WalletStandardProvider: React.FC<{ children: ReactElement }>;
}
