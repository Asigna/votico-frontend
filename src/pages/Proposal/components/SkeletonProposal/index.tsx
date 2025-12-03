import React from 'react';

import { Skeleton } from '@kit';

export const SkeletonProposal: React.FC = React.memo(() => {
  return (
    <div className="max-w-[702rem] mx-auto pb-12 w-full">
      <Skeleton width="80%" height="40rem" />
      <div className="mt-16 flex items-center pb-16 border-b border-white-10">
        <Skeleton width="24rem" height="24rem" className="bg-inherit rounded-[12rem]" />
        <Skeleton width="100rem" height="16rem" className="ml-8" />
        <span className="text-r14 text-regular ml-12 opacity-50">·</span>
        <Skeleton width="90rem" height="24rem" className="ml-8" />
        <div className="flex flex-1 justify-end">
          <Skeleton width="82rem" height="32rem" />
        </div>
      </div>
      <div className="markdown-body mt-24">
        <Skeleton width="100%" height="16rem" />
      </div>
      <div className="markdown-body mt-8">
        <Skeleton width="70%" height="16rem" />
      </div>
      <div className="markdown-body mt-8">
        <Skeleton width="70%" height="16rem" />
      </div>
      <div className="markdown-body mt-24">
        <Skeleton width="100%" height="16rem" />
      </div>
      <div className="markdown-body mt-8">
        <Skeleton width="70%" height="16rem" />
      </div>
    </div>
  );
});
