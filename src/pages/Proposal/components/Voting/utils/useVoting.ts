import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { castVote } from '@api/proposal';
import { Proposal } from '@pages/utils/types';
import { isFuture, isPast } from 'date-fns';

const useVoting = (proposal: Proposal, fetchProposal: () => void) => {
  const { proposalId } = useParams();
  const isActive = !isPast(new Date(proposal.endDate));
  const isPending = isFuture(new Date(proposal.startDate));
  const [isCanVote, setIsCanVote] = useState(isPending ? false : isActive);

  const handleCastVote = useCallback(
    async (answers: { key: string; value?: number }[]) => {
      if (proposalId) {
        const response = await castVote({ proposalId, answers });
        if (response.data.success) {
          setIsCanVote(false);
          fetchProposal();
        }
      }
    },
    [fetchProposal, proposalId]
  );

  return useMemo(() => ({ handleCastVote, isCanVote }), [handleCastVote, isCanVote]);
};

export default useVoting;
