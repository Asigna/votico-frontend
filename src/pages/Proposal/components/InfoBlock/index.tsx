import React, { useState } from 'react';
import cx from 'classnames';
import { format, isPast } from 'date-fns';

import { Image, Modal, Skeleton, Text } from '@kit';
import { Project, Proposal } from '@pages/utils/types';
import { AssetImage, StrategiesModal, VotingResult } from '@components';
import external from '@images/external.svg';
import alert from '@images/alert.svg';
import { messages } from '@utils';

import s from './index.module.scss';

type SidebarProps = {
  proposal?: Proposal & { project: Project };
  isCompleted?: boolean;
};

export const InfoBlock: React.FC<SidebarProps> = React.memo((props) => {
  const { proposal, isCompleted = false } = props;
  const [isShowStrategiesModal, setShowStrategiesModal] = useState(false);

  if (!proposal) {
    return (
      <div className="gap-24 flex flex-col overflow-y-auto sm:pb-36">
        <div className="rounded-[12rem] border-[.5px] border-white-10 bg-white-3 px-16 sm:px-24 p-24">
          <Text size="s22" font="titillium" message="General Info" />
          <Text message="Assets" color="regular" size="m14" className="mt-20" />
          <div className="flex pl-8">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton
                className={cx(s.asset, 'rounded-[8rem] mt-8')}
                width="32rem"
                height="32rem"
                key={item}
              />
            ))}
          </div>
          <Text message="IPFS" color="regular" size="m14" className="mt-20" />
          <Skeleton width="60%" height="24rem" />
          <Text message="Voting system" color="regular" size="m14" className="mt-20" />
          <Skeleton width="60%" height="24rem" />
          <Text message="Start date" color="regular" size="m14" className="mt-20" />
          <Skeleton width="60%" height="24rem" />
          <Text message="End date" color="regular" size="m14" className="mt-20" />
          <Skeleton width="60%" height="24rem" />
          <Text message="Snapshot" color="regular" size="m14" className="mt-20" />
          <Skeleton width="60%" height="24rem" />
        </div>
        <div className="rounded-[12rem] border-[.5px] border-white-10 bg-white-3 px-16 sm:px-24 p-24">
          <Text message="Results" size="s22" font="titillium" />
          <div className="flex flex-col gap-16 mt-[20rem]">
            {[0, 1, 2].map((item) => (
              <Skeleton width="100%" height="48rem" key={`res-${item}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  const isActive = !isPast(new Date(proposal.endDate));
  const quorumReachedValue = Number(proposal.votingResult?.quorumReached);

  const isBitcredit = proposal.project.type === 'bitcredit';

  return (
    <div className="gap-24 flex flex-col overflow-y-auto sm:pb-36">
      <div className="rounded-[12rem] border-[.5px] border-white-10 bg-white-3 px-16 sm:px-24 p-24">
        <Text size="s22" font="titillium" message="General Info" />

        {Array.isArray(proposal.project.strategies) && (
          <>
            <Text message="Strategies" color="regular" size="m14" className="mt-20" />
            <button onClick={() => setShowStrategiesModal(true)}>
              <div className="flex pl-8">
                {proposal.project.strategies?.map((strategy, index) => {
                  if (!strategy.asset) {
                    return null;
                  }
                  return (
                    <AssetImage
                      className={cx(s.asset, 'rounded-[8rem] mt-8')}
                      size={32}
                      asset={strategy.asset}
                      key={strategy.asset.metadata?.tx_id || index}
                    />
                  );
                })}
              </div>
            </button>
          </>
        )}
        <Text message="IPFS" color="regular" size="m14" className="mt-20" />
        <a
          href={`${proposal.ipfsUrl}ipfs/${proposal.ipfsHash}?pinataGatewayToken=${proposal.ipfsGatewayToken}`}
          target="_blank"
          className="flex"
        >
          <Text size="m14" message="#pinata" />
          <Image src={external} size={20} color="white" className="ml-4" />
        </a>
        <Text message="Voting system" color="regular" size="m14" className="mt-20" />
        <Text size="m14" message={messages.votingType[proposal.votingType]} />
        <Text message="Start date" color="regular" size="m14" className="mt-20" />
        <Text
          size="m14"
          message={format(new Date(Number(proposal.startDate)), 'MMM dd, yyyy, h:mm a')}
        />
        <Text message="End date" color="regular" size="m14" className="mt-20" />
        <Text
          size="m14"
          message={format(new Date(Number(proposal.endDate)), 'MMM dd, yyyy, h:mm a')}
        />
        <Text message="Snapshot" color="regular" size="m14" className="mt-20" />
        {proposal.isBlockReleased ? (
          <a
            href={`https://mempool.space/block/${proposal.block}`}
            target="_blank"
            className="flex"
          >
            <Text size="m14" message={Number(proposal.block).toLocaleString('en-US')} />
            <Image src={external} size={20} color="white" className="ml-4" />
          </a>
        ) : (
          <>
            <Text size="m14" message="In progress" />
            <div className="mt-20 px-16 py-12 flex gap-8 rounded-[12rem] border-[.5px] border-white-20 bg-white-5">
              <Image src={alert} size={24} color="white" />
              <Text size="m14" message="The block of the proposal snapshot will be released soon" />
            </div>
          </>
        )}
      </div>
      {(!isBitcredit || isCompleted) && (
        <div className="rounded-[12rem] border-[.5px] border-white-10 bg-white-3 px-16 sm:px-24 p-24">
          <Text message={isActive ? 'Current results' : 'Results'} size="s22" font="titillium" />
          <VotingResult votingResult={proposal.votingResult} vertical isBitcredit={isBitcredit} />
          {proposal.project.quorum && !isNaN(Number(proposal.quorumThreshold)) && (
            <div className="rounded-[8rem] mt-16 p-12 w-full flex items-center justify-between relative overflow-hidden bg-white-10">
              <Text
                className="relative"
                message={`Quorum: ${Number(proposal.votingResult?.totalVotingPower).toFixed(0)}/${Number(proposal.quorumThreshold).toFixed(0)}`}
                size="r14"
              />
              <Text
                className="relative"
                message={`${quorumReachedValue.toFixed(2)}%`}
                size="m14"
                color={quorumReachedValue < 100 ? 'red' : 'green'}
              />
            </div>
          )}
        </div>
      )}
      <Modal
        onClose={() => {
          setShowStrategiesModal(false);
        }}
        isShow={isShowStrategiesModal}
      >
        <StrategiesModal
          strategies={
            proposal.project.strategies?.filter((item) => item.strategy !== 'QUORUM') || []
          }
        />
      </Modal>
    </div>
  );
});
