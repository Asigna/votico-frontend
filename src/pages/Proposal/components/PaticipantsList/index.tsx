import React, { useState } from 'react';
import cx from 'classnames';

import { Image, Skeleton, Text } from '@kit';
import { getShortAddress } from '@utils';
import { Avatar } from '@components';
import { IVotingPower } from '@/api/project';
import external from '@images/external.svg';
import copy from '@images/copy.svg';
import holders from '@images/holders.svg';
import { Voter } from '@/pages/utils/types';

type VoterListProps = {
  paticipants: IVotingPower[];
  refilList: IVotingPower[];
  loading: boolean;
  voters: Voter[];
  holdersCount: number;
};

export const PaticipantsList: React.FC<VoterListProps> = React.memo((props) => {
  const { paticipants, loading, refilList, voters, holdersCount } = props;
  const [activeTab, setActiveTab] = useState('Main list');

  const mainList = refilList.length > 0 ? refilList : paticipants;
  const refillList =
    refilList.length > 0
      ? paticipants.filter((item) => !refilList.some((ref) => ref.userAddress === item.userAddress))
      : [];

  const mainVotersCount = voters.filter((voter) =>
    mainList.some((main) => main.userAddress === voter.userAddress)
  ).length;

  const refilVotersCount = voters.filter((voter) =>
    refillList.some((refil) => refil.userAddress === voter.userAddress)
  ).length;

  return (
    <div className="px-16 sm:px-24 p-24 bg-white-3 border-[.5px] border-white-10 rounded-[12rem] mt-16 sm:mt-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-8 sm:gap-4 mb-8 sm:mb-0">
        <div className="flex items-center gap-8 sm:gap-12">
          <Text message="Participants" size="s22" sizeSm="s18" font="titillium" />
          <div className="flex items-center bg-primary-10 px-12 gap-4 rounded-[8px]">
            <Image src={holders} size={17} />
            <Text message="Total holders:" size="r14" color="primary" />
            <Text message={holdersCount} size="r14" color="white" />
          </div>
        </div>
        {refilList.length > 0 && (
          <div className="flex gap-8">
            <button
              className={cx(
                'border bg-white-5 flex w-fit px-12 sm:px-20 rounded-[21rem] h-[40rem] sm:h-[48rem] items-center',
                activeTab === 'Main list' ? 'border-white  bg-white-5' : 'bg-white-3 border-white-3'
              )}
              onClick={() => setActiveTab('Main list')}
            >
              <Text
                message="Main list"
                size="m14"
                color={activeTab === 'Main list' ? 'white' : 'regular'}
              />
            </button>
            <button
              className={cx(
                'border bg-white-5 flex w-fit px-12 sm:px-20 rounded-[21rem] h-[40rem] sm:h-[48rem] items-center',
                activeTab === 'Refill list'
                  ? 'border-white  bg-white-5'
                  : 'bg-white-3 border-white-3'
              )}
              onClick={() => setActiveTab('Refill list')}
            >
              <Text
                message="Refill list"
                size="m14"
                color={activeTab === 'Refill list' ? 'white' : 'regular'}
              />
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-8">
        <Text message="Voted:" size="r14" color="regular" />
        <Text
          message={`${activeTab === 'Main list' ? mainVotersCount : refilVotersCount}/${activeTab === 'Main list' ? mainList.length : refillList.length}`}
          size="r14"
        />
      </div>
      <div className="grid items-center mt-8 -mx-24 max-h-[320px] overflow-y-auto">
        {loading && (
          <>
            <div className="flex items-center border-b-[.5px] border-white-10 py-16 px-24 hover:bg-white-3">
              <div className="w-full flex items-center">
                <Skeleton className="rounded-full" width="36rem" height="36rem" />
                <Skeleton className="ml-8 sm:ml-12" width="128rem" height="24rem" />
              </div>
            </div>
            <div className="flex items-center border-b-[.5px] border-white-10 py-16 px-24 hover:bg-white-3">
              <div className="w-full flex items-center">
                <Skeleton className="rounded-full" width="36rem" height="36rem" />
                <Skeleton className="ml-8 sm:ml-12" width="128rem" height="24rem" />
              </div>
            </div>
            <div className="flex items-center border-b-[.5px] border-white-10 py-16 px-24 hover:bg-white-3">
              <div className="w-full flex items-center">
                <Skeleton className="rounded-full" width="36rem" height="36rem" />
                <Skeleton className="ml-8 sm:ml-12" width="128rem" height="24rem" />
              </div>
            </div>
          </>
        )}
        {activeTab === 'Main list' &&
          mainList.length > 0 &&
          mainList.map((paticipant) => (
            <div
              key={paticipant.userAddress ?? paticipant._id}
              className="flex items-center border-b-[.5px] border-white-10 py-16 px-24 hover:bg-white-3 group"
            >
              <div className="w-full flex items-center">
                <Avatar uniqueString={paticipant.userAddress ?? paticipant._id} size={36} />
                <Text
                  size="m14"
                  message={getShortAddress(paticipant.userAddress ?? paticipant._id)}
                  className="ml-8 sm:ml-12"
                />
                <div className="hidden group-hover:flex gap-4 ml-auto">
                  <a
                    href={`https://uniscan.cc/address/${paticipant.userAddress}`}
                    target="_blank"
                    className="flex items-center gap-4"
                  >
                    <Image src={external} size={20} color="white" />
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(paticipant.userAddress)}
                    className="flex"
                  >
                    <Image src={copy} size={20} color="white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        {activeTab === 'Refill list' &&
          refillList.length > 0 &&
          refillList.map((paticipant) => (
            <div
              key={paticipant.userAddress ?? paticipant._id}
              className="flex items-center border-b-[.5px] border-white-10 py-16 px-24 hover:bg-white-3 group"
            >
              <div className="w-full flex items-center">
                <Avatar uniqueString={paticipant.userAddress ?? paticipant._id} size={36} />
                <Text
                  size="m14"
                  message={getShortAddress(paticipant.userAddress ?? paticipant._id)}
                  className="ml-8 sm:ml-12"
                />
                <div className="hidden group-hover:flex gap-4 ml-auto">
                  <a
                    href={`https://uniscan.cc/address/${paticipant.userAddress}`}
                    target="_blank"
                    className="flex items-center gap-4"
                  >
                    <Image src={external} size={20} color="white" />
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(paticipant.userAddress)}
                    className="flex"
                  >
                    <Image src={copy} size={20} color="white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
});
