import React from 'react';
import cx from 'classnames';

import { Image, Text } from '@kit';
import { messages } from '@utils';
import btcIcon from '@images/btc-icon.png';
import trashIcon from '@images/trash.svg';
import penIcon from '@images/pen.svg';
import { Strategy, Asset } from '@/pages/utils/types';

type StrategyItemProps = {
  strategy: Strategy;
  handleDelete?: () => void;
  handleEdit?: () => void;
  handleClick?: () => void;
};

export const StrategyItem: React.FC<StrategyItemProps> = React.memo((props) => {
  const { strategy, handleDelete, handleEdit, handleClick } = props;
  const countOfWhitelistAddress = strategy.whitelist?.length || 0;
  const isEditable = typeof handleDelete === 'function' || typeof handleEdit === 'function';

  return (
    <div className={cx('flex flex-col gap-16', isEditable ? 'container' : '')}>
      <div className="flex items-center justify-between">
        <Text size="m16" message={messages.strategies[strategy.strategy]} />
        <div className="flex items-center pointer-events-none opacity-50">
          {Boolean(handleDelete) && (
            <button onClick={handleDelete} className="px-8">
              <Image src={trashIcon} size={12} />
            </button>
          )}
          {Boolean(handleEdit) && (
            <button onClick={handleEdit} className="px-8">
              <Image src={penIcon} size={12} />
            </button>
          )}
        </div>
      </div>
      {isEditable && <div className="h-[1rem] w-full bg-white-10" />}
      <div className="flex items-center justify-between">
        <Text size="m14" message="Network" color="regular" />
        <div className="flex items-center gap-4">
          <Image src={btcIcon} size={20} />
          <Text size="r14" message="Bitcoin" />
        </div>
      </div>
      {(strategy.strategy === 'WEIGHTED' || strategy.strategy === 'BITCREDIT') && (
        <>
          <div className="flex items-center justify-between">
            <Text size="m14" message="Standard" color="regular" />
            <Text
              size="r14"
              message={messages.standard[strategy?.asset?.type as Asset['type']] || ''}
            />
          </div>
          <div className="flex items-center justify-between">
            <Text
              size="m14"
              message={messages.assetName[strategy?.asset?.type as Asset['type']] || ''}
              color="regular"
            />
            <Text size="r14" message={strategy?.asset?.assetId || ''} />
          </div>
        </>
      )}
      {strategy.strategy === 'WHITELIST' && (
        <div className="flex items-center justify-between">
          <Text size="m14" message="Addresses" color="regular" />
          <button onClick={handleClick}>
            <Text
              className="underline"
              size="r14"
              message={
                `${countOfWhitelistAddress} ${countOfWhitelistAddress > 1 ? 'addresses' : 'address'}` ||
                ''
              }
            />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Text size="m14" message="Weight" color="regular" />
        <Text size="r14" message={strategy.weight || 0} />
      </div>
    </div>
  );
});
