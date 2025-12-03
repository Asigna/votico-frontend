import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import { Text, Button, Modal } from '@kit';
import { Proposal } from '@pages/utils/types';

import s from './index.module.scss';
import { VotingModal } from '../VotingModal';

type VotingProps = {
  options: string[];
  title?: string;
  onVote: (answers: { key: string; value?: number }[]) => void;
  votingResult: Proposal['userVote'] | null;
  isCanVote: boolean;
  isBitcredit?: boolean;
};

export const VotingCheck: React.FC<VotingProps> = React.memo((props) => {
  const {
    options,
    title = 'Cast your vote',
    onVote,
    votingResult,
    isCanVote,
    isBitcredit = false,
  } = props;

  const [isShowVotingModal, setIsShowVotingModal] = useState(false);
  const votingResultByCurUser = votingResult?.answers;
  const [activeVotes, setActiveVotes] = useState<string[]>(
    votingResultByCurUser ? votingResultByCurUser.map((vote) => vote.key) : []
  );

  const handleOnVote = useCallback(() => {
    onVote(activeVotes.map((item) => ({ key: item })));
    setIsShowVotingModal(false);
  }, [activeVotes, onVote]);

  return (
    <div
      className={cx(
        'px-16 sm:px-24 p-24 bg-white-3 border-[.5px] border-white-10 mt-16 sm:mt-32 rounded-[12rem]',
        votingResultByCurUser || !isCanVote ? 'pointer-events-none opacity-60' : ''
      )}
    >
      <Text message={title} size="s22" sizeSm="s18" font="titillium" />
      {options.map((option) => {
        const isActive = activeVotes.some((activeVote) => activeVote === option);
        return (
          <label
            key={option}
            className={cx(
              s.input,
              'relative flex items-center px-16 border py-4 min-h-[48rem] mt-16 rounded-[8rem] cursor-pointer',
              {
                [s.isActive]: isActive,
                'bg-white-10 border-white-30': isActive,
                'bg-white-3 border-white-10 hover:bg-white-5': !isActive,
              }
            )}
          >
            <input
              className="hidden"
              type="checkbox"
              value={option}
              checked={isActive}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                isActive
                  ? setActiveVotes((prevState) => prevState.filter((el) => el !== target.value))
                  : setActiveVotes((prevState) => [...prevState, target.value]);
              }}
            />
            <Text
              message={isBitcredit && option === 'Abstain' ? 'Neutral' : option}
              size="r14"
              color="regular"
              className="max-w-[90%] break-all"
            />
          </label>
        );
      })}
      <div className="flex items-center mt-24">
        {votingResultByCurUser && (
          <Text message="Your vote has been submitted!" size="s16" color="primary" />
        )}
        <Button
          onClick={() => setIsShowVotingModal(true)}
          size="sm"
          message="Vote"
          colorType="primary"
          className="w-[148rem] ml-auto"
          disabled={!!votingResultByCurUser || !activeVotes.length}
        />
      </div>

      <Modal onClose={() => setIsShowVotingModal(false)} isShow={isShowVotingModal}>
        <VotingModal
          choice={activeVotes
            .map((item) => (isBitcredit && item === 'Abstain' ? 'Neutral' : item))
            .join(', ')}
          handleVoting={handleOnVote}
          handleClose={() => setIsShowVotingModal(false)}
        />
      </Modal>
    </div>
  );
});
