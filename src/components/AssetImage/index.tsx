import React from 'react';
import cx from 'classnames';

import { Image } from '@kit';
import { Asset } from '@pages/utils/types';

import s from './index.module.scss';
import generateColorComponent from './utils/getColorFromLetter.ts';

type AssetProps = {
  className?: string;
  asset: Asset;
  size: number;
};

export const AssetImage: React.FC<AssetProps> = React.memo((props) => {
  const { asset, size, className } = props;

  return (
    <div
      className={cx(className, 'overflow-hidden')}
      style={{ backgroundColor: generateColorComponent(asset.assetId.charAt(0)) }}
    >
      <Image
        src={asset?.metadata?.tx_id || '_'}
        size={size}
        className={cx('flex items-center justify-center', s.image)}
        data-name={asset.assetId.charAt(0).toUpperCase()}
      />
    </div>
  );
});
