import { VoteVariant } from '@pages/utils/types';

const calculateSummary = (data: VoteVariant) => {
  const summaries = Object.entries(data.voteSummary).map(([key, value]) => ({
    title: key,
    count: parseFloat(value.votingPower),
  }));

  const totalVotingPower = summaries.reduce((sum, current) => sum + current.count, 0);

  const result = summaries.map((summary) => ({
    title: summary.title,
    count: summary.count,
    percent: totalVotingPower === 0 ? 0 : (summary.count / totalVotingPower) * 100,
  }));

  return result;
};

export default calculateSummary;
