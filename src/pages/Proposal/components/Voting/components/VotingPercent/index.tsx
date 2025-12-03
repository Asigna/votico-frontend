import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import { Text, Button, Image, Modal } from '@kit';
import { Proposal } from '@pages/utils/types';
import plusIcon from '@images/plus.svg';
import minusIcon from '@images/minus.svg';

import { VotingModal } from '../VotingModal';

type VotingProps = {
  options: string[];
  title?: string;
  onVote: (answers: { key: string; value?: number }[]) => void;
  votingResult: Proposal['userVote'] | null;
  isCanVote: boolean;
  isBitcredit?: boolean;
};

export const VotingPercent: React.FC<VotingProps> = React.memo((props) => {
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
  const [votesValue, setVotesValue] = React.useState<number[]>(
    votingResultByCurUser
      ? votingResultByCurUser.map((vote) => Number(vote.value))
      : options.map(() => 0)
  );

  const sum = votesValue.reduce((acc, currentValue) => acc + currentValue, 0);

  const handleOnVote = useCallback(() => {
    onVote(
      votesValue.map((item, index) => {
        const percent = sum > 0 ? Math.round(100 * item) / sum : 0;
        return { key: options[index], value: percent };
      })
    );
    setIsShowVotingModal(false);
  }, [onVote, votesValue, sum, options]);

  const incValue = (index: number) => {
    setVotesValue((prevState) => {
      const updatedVotesValue = [...prevState];
      updatedVotesValue[index] += 1;
      return updatedVotesValue;
    });
  };
  const decValue = (index: number) => {
    setVotesValue((prevState) => {
      const updatedVotesValue = [...prevState];
      updatedVotesValue[index] -= 1;
      return updatedVotesValue;
    });
  };

  return (
    <div
      className={cx(
        'px-16 sm:px-24 p-24 bg-white-3 border-[.5px] border-white-10 mt-16 sm:mt-32 rounded-[12rem]',
        votingResultByCurUser || !isCanVote ? 'pointer-events-none opacity-60' : ''
      )}
    >
      <Text message={title} size="s22" sizeSm="s18" font="titillium" />
      {options.map((option, index) => {
        const value = votesValue[index];
        const isActive = value > 0;
        const percent = sum > 0 ? ((100 * value) / sum).toFixed(0) : '0';
        return (
          <label
            key={option}
            className={cx(
              'relative flex justify-between items-center px-16 border py-4 min-h-[48rem] mt-16 rounded-[8rem]',
              {
                'bg-white-10 border-white-30': isActive,
                'bg-white-3 border-white-10 hover:bg-white-5': !isActive,
              }
            )}
          >
            <Text
              message={isBitcredit && option === 'Abstain' ? 'Neutral' : option}
              size="r14"
              color="regular"
              className="max-w-[90%] break-all"
            />
            <div className="flex justify-end items-center gap-16">
              {!votingResultByCurUser && (
                <div className="flex justify-end items-center gap-8">
                  <div
                    className={cx('flex justify-center items-center rounded-[28rem]', {
                      'border-[.5px] border-white-3 bg-white-3': !isActive,
                      'border-[.5px] bg-white-10 border-[#FFBD3D] cursor-pointer ': isActive,
                    })}
                    onClick={() => isActive && decValue(index)}
                  >
                    <Image src={minusIcon} size={28} className="rounded-[28rem]" />
                  </div>
                  <Text
                    message={value}
                    size="s16"
                    color="white"
                    className="w-[24rem] text-center"
                  />
                  <div
                    className="flex justify-center items-center rounded-[28rem] border-[.5px] cursor-pointer bg-white-10 border-[#FFBD3D]"
                    onClick={() => incValue(index)}
                  >
                    <Image src={plusIcon} size={28} className="rounded-[28rem]" />
                  </div>
                </div>
              )}
              <Text
                message={`${percent}%`}
                size="s16"
                color="white"
                className="min-w-[44rem] text-right"
              />
            </div>
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
          disabled={!!votingResultByCurUser || !votesValue.length}
        />
      </div>

      <Modal onClose={() => setIsShowVotingModal(false)} isShow={isShowVotingModal}>
        <VotingModal
          choice={votesValue
            .map((item, index) => {
              const percent = sum > 0 ? Math.round(100 * item) / sum : 0;
              return item > 0 ? `${options[index]} - ${percent.toFixed()}%` : '';
            })
            .filter((item) => (isBitcredit && item === 'Abstain' ? 'Neutral' : item) !== '')
            .join('; ')}
          handleVoting={handleOnVote}
          handleClose={() => setIsShowVotingModal(false)}
        />
      </Modal>
    </div>
  );
});
