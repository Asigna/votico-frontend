import React from 'react';

import { Text } from '@kit';
import { Asset, Strategy } from '@pages/utils/types';

import { groupByType, messages } from '@utils';
import { AddressLink, AssetImage } from '@components';

type AssetsProps = {
  strategies?: Strategy[];
};

export const Assets: React.FC<AssetsProps> = React.memo((props) => {
  const { strategies } = props;

  if (!strategies) {
    return null;
  }

  return (
    <div>
      {Object.entries(groupByType(strategies)).map(([type, assetsByType], index) => {
        let url: string;

        if (type === 'RUNE') {
          url = 'https://uniscan.cc/runes/detail/';
        } else if (type === 'INSCRIPTION_COLLECTION') {
          url = 'https://ordiscan.com/collection/';
        } else if (type === 'BRC_20') {
          url = 'https://uniscan.cc/brc20/';
        }

        return (
          <div key={type} className={index === 0 ? '' : 'mt-32'}>
            <Text
              message={messages.standard[type as Asset['type']] || ''}
              font="titillium"
              size="s22"
            />
            {assetsByType.map((asset, index) => (
              <div className="flex items-center mt-16" key={index}>
                <AssetImage size={64} asset={asset} className="rounded-[12rem]" />
                <Text size="m14" message={asset.assetId || ''} className="ml-12" />
                <AddressLink
                  url={asset.metadata?.url || url}
                  address={asset.metadata?.tx_id || asset.assetId || ''}
                  isDirectUrl={Boolean(asset.metadata?.url)}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
});
