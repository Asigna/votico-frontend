import React from 'react';
import cx from 'classnames';
import s from './index.module.scss';
import { Text } from '@kit';

type StatusBadgeProps = {
  isActive: boolean;
  isPending?: boolean;
};

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo((props) => {
  const { isActive, isPending = false } = props;
  return (
    <Text
      size="r14"
      sizeSm="r12"
      className={cx(
        s.badge,
        {
          [s.isActive]: isActive,
          [s.isPending]: isPending,
        },
        'rounded-[8rem] py-4 pl-12 sm:pl-20 pr-8 sm:pr-12 relative ml-auto'
      )}
      color={isPending ? 'primary' : isActive ? 'green' : 'regular'}
      message={isPending ? 'Pending' : isActive ? 'Active' : 'Completed'}
    />
  );
});
