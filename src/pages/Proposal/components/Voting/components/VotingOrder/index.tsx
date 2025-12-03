import React, { useCallback, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import cx from 'classnames';

import { Text, Button, Image, Modal } from '@kit';
import dragIcon from '@images/drag.svg';
import { Proposal } from '@pages/utils/types';

import { VotingModal } from '../VotingModal';

type VotingProps = {
  options: string[];
  title?: string;
  onVote: (answers: { key: string; value?: number }[]) => void;
  votingResult: Proposal['userVote'] | null;
  isCanVote: boolean;
  isBitcredit?: boolean;
};

export const VotingOrder: React.FC<VotingProps> = React.memo((props) => {
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

  const [items, setItems] = useState<{ id: string; item: string }[]>(
    votingResultByCurUser
      ? votingResultByCurUser.map((item, index) => ({
          item: item.key,
          id: index.toString(),
        }))
      : options.map((item, index) => ({
          item,
          id: index.toString(),
        }))
  );

  const handleOnVote = useCallback(() => {
    onVote(items.map((item) => ({ key: item.item })));
    setIsShowVotingModal(false);
  }, [items, onVote]);

  return (
    <div
      className={cx(
        'p-24 bg-white-3 border-[.5px] border-white-10 mt-32 rounded-[12rem]',
        votingResultByCurUser || !isCanVote ? 'pointer-events-none opacity-60' : ''
      )}
    >
      <Text message={title} size="s22" sizeSm="s18" font="titillium" />
      <ReactSortable list={items} setList={setItems} className="flex flex-col gap-8">
        {items.map((option, index) => {
          return (
            <label
              key={option.item}
              className="relative flex items-center px-16 border border-white-10 py-4 min-h-[48rem] mt-16 rounded-[8rem] cursor-pointer gap-8"
            >
              <Image src={dragIcon} size={24} className="cursor-grab" />
              <Text
                message={
                  index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`
                }
                size="r14"
                color="regular"
              />

              <Text message={option.item} size="s16" color="white" />
            </label>
          );
        })}
      </ReactSortable>
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
          disabled={!!votingResultByCurUser}
        />
      </div>

      <Modal onClose={() => setIsShowVotingModal(false)} isShow={isShowVotingModal}>
        <VotingModal
          choice={items
            .map((item) => (isBitcredit && item.item === 'Abstain' ? 'Neutral' : item))
            .join(', ')}
          handleVoting={handleOnVote}
          handleClose={() => setIsShowVotingModal(false)}
        />
      </Modal>
    </div>
  );
});
