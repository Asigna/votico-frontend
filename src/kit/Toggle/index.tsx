import React from 'react';
import cx from 'classnames';

import s from './index.module.scss';

type ToggleProps = {
  isActive: boolean;
  onClick: () => void;
  className?: string;
};

export const Toggle: React.FC<ToggleProps> = React.memo((props) => {
  const { isActive, className, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={cx(
        'relative border-[.5px] border-white-10 rounded-[32rem] h-[24rem] w-[40rem] cursor-pointer transition',
        s.wrap,
        className,
        isActive ? 'bg-gradient-to-r from-primary-grad-1 to-primary-grad-2' : 'bg-white-10',
        { [s.active]: isActive }
      )}
    />
  );
});
