import React from 'react';

import { Image, Text } from '@kit';
import bookIcon from '@images/book.svg';

export const EmptyProposalList: React.FC = React.memo(() => {
  return (
    <div className="flex flex-col items-center gap-40 mt-[98rem]">
      <div className="flex flex-col items-center gap-24">
        <Image src={bookIcon} size={40} />
        <Text size="m18" message="No proposals found" />
      </div>
      <div className="flex items-center gap-16"></div>
    </div>
  );
});

EmptyProposalList.displayName = 'EmptyProposalList';
