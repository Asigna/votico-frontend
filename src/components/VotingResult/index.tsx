import React from 'react';
import cx from 'classnames';

import { Text } from '@kit';
import { formatNumberToShortString } from '@utils';
import { VoteVariant } from '@pages/utils/types';

import calculateSummary from './utils/calculateSummary.ts';

type VotingResultProps = {
  votingResult?: VoteVariant;
  vertical?: boolean;
  isBitcredit?: boolean;
};

export const VotingResult: React.FC<VotingResultProps> = React.memo((props) => {
  const { votingResult, vertical, isBitcredit = false } = props;

  if (votingResult && Object.keys(votingResult.voteSummary).length > 0) {
    const items = calculateSummary(votingResult);

    const maxPercent = items.reduce((max, current) => {
      return current.percent > max ? current.percent : max;
    }, -Infinity);

    return (
      <div className={cx('flex justify-between gap-16 mt-20', vertical ? 'flex-col' : '')}>
        {items.map((vote) => (
          <div
            key={vote.title}
            className="rounded-[8rem] p-12 w-full flex items-center justify-between relative overflow-hidden bg-white-10"
          >
            <div
              className={cx(
                'h-full absolute left-0 top-0 transition',
                vote.percent.toFixed(4) === maxPercent.toFixed(4)
                  ? 'bg-gradient-to-r from-primary-grad-1 to-primary-grad-2'
                  : 'bg-white-10'
              )}
              style={{ width: `${vote.percent}%` }}
            />
            <Text
              className="relative max-w-[88%] break-all"
              message={`${isBitcredit && vote.title === 'Abstain' ? 'Neutral' : vote.title}: ${formatNumberToShortString(vote.count)}`}
              size="r14"
            />
            <Text className="relative" message={`${Number(vote.percent.toFixed(2))}%`} size="m14" />
          </div>
        ))}
      </div>
    );
  }

  return null;
});

VotingResult.displayName = 'VotingResult';
