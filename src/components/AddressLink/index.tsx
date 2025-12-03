import React from 'react';
import { Image, Text } from '@kit';
import { getShortAddress } from '@utils';
import external from '@images/external.svg';
import cx from 'classnames';

type AddressLinkProps = {
  address: string;
  isAddress?: boolean;
  url?: string;
  isLeft?: boolean;
  isDirectUrl?: boolean;
};

export const AddressLink: React.FC<AddressLinkProps> = React.memo((props) => {
  const {
    address,
    url = 'https://mempool.space/tx/',
    isAddress = false,
    isLeft = false,
    isDirectUrl = false,
  } = props;
  return (
    <a
      className={cx('flex items-center', !isLeft && 'ml-auto')}
      target="_blank"
      href={
        isDirectUrl ? url : isAddress ? `https://uniscan.cc/address/${address}` : `${url}${address}`
      }
    >
      <Text
        tag="span"
        message={getShortAddress(address)}
        size="m14"
        color="regular"
        className={!isLeft ? 'ml-12' : ''}
      />
      <Image src={external} size={16} className="ml-8" />
    </a>
  );
});
