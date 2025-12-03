import React, { startTransition, useCallback } from 'react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNowStrict, isFuture, isPast } from 'date-fns';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Image, Skeleton, Text } from '@kit';
import { Avatar, StatusBadge, VotingResult } from '@components';
import { Project, Proposal } from '@pages/utils/types';
import paths from '@constants/paths.ts';

import strategicIcon from '@images/strategic.svg';
import deliveryIcon from '@images/delivery.svg';
import contributionIcon from '@images/contribution.svg';
import rewardIcon from '@images/reward.svg';
import deadlineIcon from '@images/deadline.svg';

export const ProposalItem: React.FC<
  Proposal & { project?: Project; setIsLoading: (isLoading: boolean) => void }
> = React.memo((props) => {
  const {
    _id,
    project,
    endDate,
    startDate,
    title,
    text,
    votingResult,
    setIsLoading,
    isBlockReleased,
    quorumReached,
    proposalType,
    nextMilestone,
    retryCount,
  } = props;

  const navigate = useNavigate();

  const isActive = !isPast(new Date(endDate));
  const isPending = isFuture(new Date(startDate));

  const formatedEndDate = `${isActive ? 'Voting ends in' : 'Voting ended'} ${formatDistanceToNowStrict(
    new Date(endDate)
  )} ${isActive ? ' ' : 'ago'}`;
  const formatedStartDate = `Voting starts in ${formatDistanceToNowStrict(new Date(startDate))}`;

  const formatted = nextMilestone?.deadline
    ? format(new Date(Number(nextMilestone?.deadline)), 'MMM dd, yyyy, h:mm a')
    : '';

  const handleNavigateToProposal = useCallback(() => {
    setIsLoading(true);
    startTransition(() => {
      navigate(`/${paths.PROPOSAL}/${_id}`);
    });
  }, [_id, navigate, setIsLoading]);

  const isBitcredit = project?.name === 'Bitcredit Protocol';

  return (
    <div
      onClick={handleNavigateToProposal}
      className="container flex flex-col cursor-pointer hover:border-white-20 hover:bg-white-5 transition w-full"
    >
      <div className="flex items-center flex-wrap">
        {project?.avatar && <Avatar uniqueString={project._id} src={project.avatar} size={24} />}
        <div className="flex flex-col sm:flex-row sm:items-center">
          {project?.name && (
            <Text size="m14" sizeSm="r13" message={project.name} className="ml-8" />
          )}
          <span className="text-r14 text-regular ml-12 hidden sm:block">·</span>
          <Text
            color="regular"
            size="r14"
            sizeSm="r12"
            message={isPending ? formatedStartDate : formatedEndDate}
            className="ml-8"
          />
          {!(isPending || !isBlockReleased) && Boolean(quorumReached) && project?.quorum && (
            <>
              <span className="text-r14 text-regular ml-12 hidden sm:block">·</span>
              <Text
                color={Number(quorumReached) < 100 ? 'red' : 'green'}
                size="r14"
                message={`${Number(quorumReached).toFixed(2)}% quorum reached`}
                className="ml-8"
              />
            </>
          )}
          {isBitcredit && retryCount === 1 && (
            <>
              <span className="text-r14 text-regular mx-8 hidden sm:block">·</span>
              <div className="flex items-center gap-4 px-12 py-4 text-r12 rounded-[8px] bg-white-3">
                Refill
              </div>
            </>
          )}
        </div>
        <StatusBadge isActive={isActive} isPending={isPending || !isBlockReleased} />
      </div>
      <Text
        message={title.slice(0, 160) + (title.length > 160 ? '...' : '')}
        size="s22"
        className="mt-20 break-all"
        font="titillium"
      />

      <div className="text-r14 mt-8 text-regular break-all">
        <Markdown remarkPlugins={[remarkGfm]}>
          {text.slice(0, 160) + (text.length > 160 ? '...' : '')}
        </Markdown>
      </div>
      <VotingResult votingResult={votingResult} />
      {isBitcredit && (
        <div className="flex items-center gap-8 flex-wrap">
          {/* {proposalType === 'common' && (
            <div className="flex items-center gap-4 px-16 py-4 text-r14 mt-8 text-regular rounded-[8px] bg-primary-5">
              Common
            </div>
          )} */}
          {proposalType === 'contribution_proposal' && (
            <div className="flex items-center gap-4 px-16 py-4 text-r12 sm:text-r14 mt-8 text-[#FFA6E1] rounded-[8px] bg-[#FFA6E10D]">
              <Image src={contributionIcon} size={16} />
              Contribution proposal
            </div>
          )}
          {proposalType === 'delivery_acceptance' && (
            <div className="flex items-center gap-4 px-16 py-4 text-r12 sm:text-r14 mt-8 text-green rounded-[8px] bg-green-5">
              <Image src={deliveryIcon} size={16} />
              Delivery acceptance
            </div>
          )}
          {proposalType === 'strategic_decision' && (
            <div className="flex items-center gap-4 px-16 py-4 text-r12 sm:text-m14 mt-8 text-primary rounded-[8px] bg-primary-5">
              <Image src={strategicIcon} size={16} />
              Strategic decision
            </div>
          )}

          {nextMilestone?.rewardAmount && (
            <div className="flex items-center gap-4 px-16 py-4 text-r14 mt-8 text-regular rounded-[8px] bg-[#71acff0d]">
              <Image src={rewardIcon} size={16} />
              <Text message="Reward:" className="!text-[#71ACFF]" size="m14" sizeSm="r12" />
              <Text message={`${nextMilestone.rewardAmount} e-IOU` || ''} size="r14" sizeSm="r12" />
            </div>
          )}
          {formatted && (
            <div className="flex items-center gap-4 px-16 py-4 text-r14 mt-8 text-regular rounded-[8px] bg-[#C17FFF0D]">
              <Image src={deadlineIcon} size={16} />
              <Text message="Deadline:" className="!text-[#C17FFF]" size="m14" sizeSm="r12" />
              <Text message={formatted} size="r14" sizeSm="r12" />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProposalItem.displayName = 'ProposalItem';

type SkeletonProposalItemProps = {
  bg: number;
};

export const SkeletonProposalItem: React.FC<SkeletonProposalItemProps> = React.memo((props) => {
  const { bg } = props;
  return (
    <div
      className={cx(bg === 0 ? 'bg-white-3' : 'bg-white-5', 'p-24 rounded-[12rem] flex flex-col')}
    >
      <div className="flex items-center">
        <Skeleton width="24rem" height="24rem" className="bg-inherit rounded-[12rem]" />
        <Skeleton width="90rem" height="24rem" className="ml-8" />
        <span className="text-r14 text-regular ml-12 opacity-50">·</span>
        <Skeleton width="90rem" height="24rem" className="ml-8" />
        <div className="flex flex-1 justify-end">
          <Skeleton width="82rem" height="32rem" />
        </div>
      </div>
      <Skeleton width="100%" height="28rem" className="mt-20" />
      <Skeleton width="100%" height="24rem" className="mt-8 w-full" />
      <Skeleton width="100%" height="24rem" className="mt-8 w-full" />
    </div>
  );
});
