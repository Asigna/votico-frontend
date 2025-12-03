import React from 'react';

import { Image, Text } from '@kit';
import { Asset, Strategy } from '@pages/utils/types';

import { groupByType, messages } from '@utils';
import { AddressLink, AssetImage } from '@components';
import ogPeeps from '../../utils/images/ogpeeps.png';
import daoPeeps from '../../utils/images/peepsdao.webp';

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
            {assetsByType.map((asset, index) => {
              let isDirectUrl = false;
              let isChangeImage = 0;
              if (asset.assetId === 'On-Chain Genesis by PeePs') {
                url = 'https://magiceden.io/ordinals/marketplace/ocgbypeeps';
                isDirectUrl = true;
                isChangeImage = 1;
              }
              if (asset.assetId === 'PeePsDAO Access Pass') {
                url = 'https://magiceden.io/ordinals/marketplace/peepsdao';
                isDirectUrl = true;
                isChangeImage = 2;
              }

              return (
                <div className="flex items-center mt-16" key={index}>
                  {isChangeImage == 1 ? (
                    <Image src={ogPeeps} size={64} className="rounded-[12rem]" />
                  ) : isChangeImage == 2 ? (
                    <Image src={daoPeeps} size={64} className="rounded-[12rem]" />
                  ) : (
                    <AssetImage size={64} asset={asset} className="rounded-[12rem]" />
                  )}
                  <Text size="m14" message={asset.assetId || ''} className="ml-12" />
                  <AddressLink
                    url={url}
                    address={asset.metadata?.tx_id || asset.assetId || ''}
                    isDirectUrl={isDirectUrl}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});
