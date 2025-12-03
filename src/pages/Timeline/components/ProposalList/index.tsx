import React, { useState } from 'react';
import cx from 'classnames';

import { random } from '@utils';
import { Proposal } from '@pages/utils/types';

import { ProposalItem, SkeletonProposalItem } from './components/ProposalItem';
import { EmptyProposalList } from './components/EmptyProposalList';

type ProposalListProps = {
  isLoading: boolean;
  proposals: Proposal[];
};

export const ProposalList: React.FC<ProposalListProps> = React.memo((props) => {
  const { isLoading, proposals } = props;
  const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false);

  return (
    <div
      className={cx(
        'gap-24 flex flex-col',
        isLoadingProposal ? 'pointer-events-none opacity-60' : ''
      )}
    >
      {isLoading ? (
        <SkeletonProposalItem bg={random(0, 1)} />
      ) : (
        <>
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalItem setIsLoading={setIsLoadingProposal} key={proposal._id} {...proposal} />
            ))
          ) : (
            <EmptyProposalList />
          )}
        </>
      )}
    </div>
  );
});
