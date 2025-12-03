import { useEffect, useMemo, useState } from 'react';
import { getVotingPower } from '@api/proposal.ts';
import { useParams } from 'react-router-dom';

const useVotingModal = () => {
  const { proposalId } = useParams();
  const [votingData, setVotingData] = useState({
    currentVotingPower: 0,
    block: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      if (proposalId) {
        try {
          const response = await getVotingPower(proposalId);
          const result = response?.data?.data || {};
          setVotingData({
            currentVotingPower: Number(result.currentVotingPower),
            block: result.block,
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetch();
  }, []);

  return useMemo(() => ({ votingData }), [votingData]);
};

export default useVotingModal;
