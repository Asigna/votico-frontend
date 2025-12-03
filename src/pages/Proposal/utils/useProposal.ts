import { useMemo, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Project, Proposal } from '@pages/utils/types';
import {
  getProposalById,
  getProposalSummaryById,
  getProposalVotesById,
  deleteProposal,
  getProposalCurrentPower,
  getProposalHistoryPower,
} from '@api/proposal';
import { getProjectById, IVotingPower } from '@api/project.ts';

const handleGetProposal = async (
  proposalId?: string
): Promise<(Proposal & { project: Project }) | undefined> => {
  if (!proposalId) {
    return undefined;
  }

  try {
    const proposalResult = await getProposalById(proposalId);
    const proposal = proposalResult?.data?.data || {};

    const projectResult = await getProjectById(proposal.projectId);
    const project = projectResult?.data?.data || {};

    const votesResult = await getProposalVotesById(proposalId);
    const voterList = votesResult?.data?.data || {};

    const summaryResult = await getProposalSummaryById(proposalId);
    const votingResult = summaryResult?.data?.data || {};

    return {
      ...proposal,
      project,
      voterList,
      votingResult,
    };
  } catch (error) {
    console.error(error);
  }
};

const useProposal = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState<Proposal & { project: Project }>();
  const [paticipants, setPaticipants] = useState<IVotingPower[]>([]);
  const [paticipantsRefill, setPaticipantsRefill] = useState<IVotingPower[]>([]);
  const [isLoadingPaticipants, setLoadingPaticipants] = useState(false);

  const fetchProposal = useCallback(async () => {
    const proposal = await handleGetProposal(proposalId);
    if (proposal) {
      setProposal(proposal);
    }
  }, [proposalId]);

  useEffect(() => {
    if (!proposalId) return;
    if (!proposal) return;
    if (proposal.project.type !== 'bitcredit') return;
    setLoadingPaticipants(true);

    const fetchAllPages = async () => {
      try {
        const limit = 25;
        let page = 0;
        const allData: IVotingPower[] = [];
        let hasMore = true;

        while (hasMore) {
          const res = await getProposalCurrentPower(proposalId, page, limit);
          const data = res.data?.data || [];

          if (data.length === 0) break;

          allData.push(...data);
          page++;

          if (data.length < limit) hasMore = false;
        }

        setPaticipants(allData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPaticipants(false);
      }
    };
    const fetchHistoryAllPages = async () => {
      try {
        const limit = 25;
        let page = 0;
        const allData: IVotingPower[] = [];
        let hasMore = true;

        while (hasMore) {
          const res = await getProposalHistoryPower(proposalId, page, limit);
          const data = res.data?.data || [];

          if (data.length === 0) break;

          allData.push(...data);
          page++;

          if (data.length < limit) hasMore = false;
        }

        setPaticipantsRefill(allData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllPages();
    fetchHistoryAllPages();
  }, [proposal, proposalId]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const onDeleteProposal = useCallback(async (proposalId: string) => {
    try {
      await deleteProposal(proposalId);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return useMemo(
    () => ({
      proposal,
      fetchProposal,
      onDeleteProposal,
      paticipants,
      isLoadingPaticipants,
      paticipantsRefill,
    }),
    [
      proposal,
      fetchProposal,
      onDeleteProposal,
      paticipants,
      isLoadingPaticipants,
      paticipantsRefill,
    ]
  );
};

export default useProposal;
