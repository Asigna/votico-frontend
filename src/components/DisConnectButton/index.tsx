import React, { useState } from 'react';
import cx from 'classnames';

import { Text, Image } from '@kit';
import arrowIcon from '@images/arrow.svg';
import disconnectIcon from '@images/disconnect.svg';

import { getShortAddress } from '../../utils';
import s from './index.module.scss';

type DisConnectButtonProps = {
  address: string;
};

export const DisConnectButton: React.FC<DisConnectButtonProps> = React.memo((props) => {
  const { address } = props;
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={cx(
          s.button,
          'rounded-[20rem] py-8 px-[14rem] flex items-center gap-8 cursor-pointer'
        )}
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <Text size="r14" message={getShortAddress(address)} />
        <Image
          src={arrowIcon}
          size={20}
          className={cx('transition', isOpen ? 'rotate-180' : 'rotate-0')}
        />
      </div>
      {isOpen && (
        <div
          className={cx(s.bg, 'fixed inset-x-0 inset-y-0 z-0')}
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      {isOpen && (
        <div
          className={cx(
            s.dropdownWrapper,
            'absolute z-10 right-0 top-[44rem] flex justify-start items-center px-16 py-8 cursor-pointer rounded-[20rem] gap-8 min-w-[149rem]'
          )}
          onClick={() => {
            localStorage.clear();
            setOpen(false);
            window.location.reload();
          }}
        >
          <Image
            src={disconnectIcon}
            size={20}
            className={cx('transition', isOpen ? 'rotate-180' : 'rotate-0')}
          />
          <Text className="font-normal text-nowrap" message="Disconnect" size="m14" />
        </div>
      )}
    </div>
  );
});
