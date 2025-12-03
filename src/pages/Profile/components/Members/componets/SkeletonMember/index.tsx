import React from 'react';

import { Dropdown, Image, Skeleton } from '@kit';
import trashIcon from '@images/trash.svg';

export const SkeletonMember: React.FC = React.memo(() => {
  return (
    <div className="flex items-center">
      <Skeleton width="40rem" height="40rem" className="bg-inherit rounded-[20rem]" />
      <Skeleton width="100rem" height="16rem" className="ml-12" />
      <Dropdown
        className="sm:min-w-[140rem] ml-auto"
        selected={['-']}
        items={['-']}
        onChange={() => {}}
        disabled
      />
      <div className="pl-16">
        <Image src={trashIcon} size={12} className="opacity-20" />
      </div>
    </div>
  );
});
