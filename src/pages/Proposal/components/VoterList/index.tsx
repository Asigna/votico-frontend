import React from 'react';

import { Voter } from '@pages/utils/types';
import { Text } from '@kit';
import { getShortAddress } from '@utils';
import { Avatar } from '@components';

type VoterListProps = {
  voterList: Voter[];
  isBitcredit?: boolean;
};

export const VoterList: React.FC<VoterListProps> = React.memo((props) => {
  const { voterList, isBitcredit = false } = props;

  return (
    <div className="px-16 sm:px-24 p-24 bg-white-3 border-[.5px] border-white-10 rounded-[12rem] mt-16 sm:mt-32">
      <Text
        message={`Votes (${voterList?.length || 0})`}
        size="s22"
        sizeSm="s18"
        font="titillium"
      />
      {Array.isArray(voterList) && voterList.length > 0 && (
        <div className="grid items-center gap-24 mt-24">
          <div className="grid grid-cols-[140px_150px_auto] items-center gap-4">
            <Text size="m14" message="Wallet" color="regular" className="w-full" />
            <Text size="m14" message="Voting power" color="regular" className="w-full" />
            <Text
              size="m14"
              message="Vote"
              color="regular"
              className="w-full text-right min-w-[55%]"
            />
          </div>
          {voterList.map((voter) => {
            const answers = voter.answers
              .filter((answer) => Number(answer.votingPower) > 0)
              .reduce(
                (acc, item) => {
                  if (acc.decision) {
                    acc.decision += `,\r\n ${item.key}`;
                  } else {
                    acc.decision = item.key;
                  }
                  acc.votingPower = (acc.votingPower || 0) + Number(item.votingPower);
                  return acc;
                },
                { decision: '', votingPower: 0 }
              );

            return (
              <div
                key={voter.userAddress}
                className="grid grid-cols-[140px_50px_auto] items-start gap-4"
              >
                <div className="w-full flex items-center">
                  <Avatar uniqueString={voter.userAddress} src={voter.image} size={24} />
                  <Text
                    size="m14"
                    message={getShortAddress(voter.userAddress)}
                    className="ml-8 sm:ml-12"
                  />
                </div>
                <Text
                  size="m14"
                  message={
                    answers.votingPower < 0.01 && answers.votingPower > 0
                      ? '< 0.01'
                      : Math.floor(answers.votingPower * 100) / 100
                  }
                  className="w-full ml-12"
                />
                <Text
                  size="m14"
                  message={
                    isBitcredit && answers.decision === 'Abstain' ? 'Neutral' : answers.decision
                  }
                  className="w-full break-all whitespace-pre-line"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
