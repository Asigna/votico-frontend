import React from 'react';

import { Project, Proposal } from '@pages/utils/types';
import { useAddress } from '@store';

import { VotingCheck, VotingPercent, VotingRadio } from './components';
import useVoting from './utils/useVoting.ts';
import { IVotingPower } from '@/api/project.ts';

type VotingProps = {
  proposal: Proposal & {
    project: Project;
  };
  fetchProposal: () => void;
  paticipants: IVotingPower[];
};

export const Voting: React.FC<VotingProps> = React.memo((props) => {
  const { proposal, fetchProposal, paticipants } = props;
  const { handleCastVote, isCanVote } = useVoting(proposal, fetchProposal);
  const { address } = useAddress();

  const isShowVoting = Array.isArray(proposal.options) && proposal.options.length > 0;
  const isBitcredit = proposal.project?.name === 'Bitcredit Protocol';
  const inPaticipants =
    paticipants.findIndex((paticipant) => paticipant.userAddress === address) !== -1;

  const isBitcreditCanVote = (isBitcredit && inPaticipants) || !isBitcredit;

  if (!isShowVoting) {
    return null;
  }

  switch (proposal.votingType) {
    case 'weighted': {
      return (
        <VotingPercent
          options={proposal.options || []}
          onVote={handleCastVote}
          votingResult={proposal.userVote}
          isCanVote={
            isCanVote && Boolean(address) && proposal.isBlockReleased && isBitcreditCanVote
          }
          isBitcredit={isBitcredit}
        />
      );
    }
    case 'approval': {
      return (
        <VotingCheck
          options={proposal.options || []}
          onVote={handleCastVote}
          votingResult={proposal.userVote}
          isCanVote={
            isCanVote && Boolean(address) && proposal.isBlockReleased && isBitcreditCanVote
          }
          isBitcredit={isBitcredit}
        />
      );
    }
    default: {
      return (
        <VotingRadio
          options={proposal.options || []}
          onVote={handleCastVote}
          votingResult={proposal.userVote}
          isCanVote={
            isCanVote && Boolean(address) && proposal.isBlockReleased && isBitcreditCanVote
          }
          isBitcredit={isBitcredit}
        />
      );
    }
  }
});
