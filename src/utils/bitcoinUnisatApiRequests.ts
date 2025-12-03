import { getApiBAseUrl } from '@api/auth';

export interface BitcoinBalance {
  btc_amount: string;
}

export interface TokenTransfer {
  ticker: string;
  amount: string;
  inscriptionId: string;
  inscriptionNumber: number;
  timestamp: number;
}

export const getBitcoinBalance = async (
  address: string,
  metaTokenQuantity = 0
): Promise<BitcoinBalance> => {
  const url = `${getApiBAseUrl()}unisat-new/address/balance?address=${address}`;

  const res = await fetch(url);

  const data = (await res.json()).data;

  return {
    ...data,
    btc_amount: (
      (data.satoshi - metaTokenQuantity + data.pendingSatoshi) /
      Math.pow(10, 8)
    ).toString(),
  };
};
