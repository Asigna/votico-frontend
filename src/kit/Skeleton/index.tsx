import React from 'react';
import cx from 'classnames';
import s from './index.module.scss';

type SkeletonProps = {
  width?: string;
  height?: string;
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = React.memo((props) => {
  const { width, height, className } = props;
  return (
    <div
      className={cx(className, s.component, 'h-full w-full rounded-[8rem] overflow-hidden')}
      style={{ width, height }}
    />
  );
});
