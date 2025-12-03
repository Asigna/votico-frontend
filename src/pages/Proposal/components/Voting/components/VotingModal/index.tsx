import React from 'react';

import { Button, Text, Image } from '@kit';
import external from '@images/external.svg';

import useVotingModal from './utils/useVotingModal.ts';
import warningIcon from '@images/warning.svg';

type VotingModalProps = {
  choice: string;
  handleClose: () => void;
  handleVoting: () => void;
};

export const VotingModal: React.FC<VotingModalProps> = React.memo((props) => {
  const { choice, handleClose, handleVoting } = props;
  const { votingData } = useVotingModal();

  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] sm:min-w-[456rem] flex flex-col gap-32 border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Cast your vote" size="s22" sizeSm="s18" />
      <div className="flex flex-col gap-16">
        <div className="flex justify-between items-center gap-16">
          <Text message="Choice" size="r14" color="regular" />
          <Text message={choice} size="r14" color="white" />
        </div>
        <div className="flex justify-between items-center gap-16">
          <Text message="Snapshot" size="r14" color="regular" />

          <a
            href={`https://mempool.space/block/${votingData.block}`}
            target="_blank"
            className="flex items-center gap-4"
          >
            {Boolean(votingData.block) && (
              <>
                <Text message={votingData.block} size="r14" color="white" />
                <Image src={external} size={18} color="white" />
              </>
            )}
          </a>
        </div>
        <div className="flex justify-between items-center gap-16">
          <Text message="Your voting power" size="r14" color="regular" />
          {Boolean(votingData.block) && (
            <Text message={votingData.currentVotingPower} size="r14" color="white" />
          )}
        </div>
      </div>
      {!votingData.currentVotingPower && Boolean(votingData.block) && (
        <div className="py-12 px-16 mt-24 flex bg-primary-10 border-[.5px] border-primary-30 rounded-[8rem]">
          <Image src={warningIcon} size={24} />
          <div className="ml-8">
            <Text
              className="inline"
              message={`You don't have any voting power at block ${votingData.block}.`}
              size="m16"
            />
            <a href="#" className="inline-block ml-4">
              <Text className="inline" message="Learn more" size="m16" color="primary" />
            </a>
          </div>
        </div>
      )}
      <div className="flex gap-16">
        <Button
          message="Cancel"
          colorType="secondary"
          size="md"
          className="mx-auto w-full"
          onClick={handleClose}
        />
        <Button
          message="Vote"
          size="md"
          className="mx-auto w-full"
          onClick={handleVoting}
          disabled={!votingData.currentVotingPower}
        />
      </div>
    </div>
  );
});
