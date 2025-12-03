import React, { startTransition, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';

import { Text, Image } from '@kit';
import { Project, Proposal } from '@pages/utils/types';
import paths from '@constants/paths.ts';
import { Avatar, StatusBadge } from '@components';
import dotsIcon from '@images/dots.svg';
// import editIcon from '@images/edit20.svg';
import deleteIcon from '@images/trash20.svg';
import strategicIcon from '@images/strategic.svg';
import deliveryIcon from '@images/delivery.svg';
import contributionIcon from '@images/contribution.svg';

import s from './index.module.scss';

type ProposalHeadProps = {
  proposal: Proposal & { project: Project };
  isActive: boolean;
  isPending: boolean;
  className: string;
  onDeleteProposal: (proposalId: string) => void;
  full?: boolean;
};

export const ProposalHead: React.FC<ProposalHeadProps> = React.memo((props) => {
  const { proposal, isActive, isPending, className, onDeleteProposal, full = false } = props;
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  const formatedEndDate = `${isActive ? 'Voting ends in' : 'Voting ended'} ${formatDistanceToNowStrict(
    new Date(Number(proposal.endDate))
  )} ${isActive ? ' ' : 'ago'}`;
  const formatedStartDate = `Voting starts in ${formatDistanceToNowStrict(new Date(proposal.startDate))}`;

  const handleNavigation = () => {
    startTransition(() => {
      navigate(`/${paths.TIMELINE}/${proposal.project._id}`);
    });
  };

  const isBitcredit = proposal.project.type === 'bitcredit';

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <Text
          message={
            full
              ? proposal.title
              : proposal.title.slice(0, 255) + (proposal.title.length > 255 ? '...' : '')
          }
          size="b32"
          sizeSm="s22"
          className="break-all"
        />
        {proposal.project.roles?.includes('admin') && (
          <div className="relative">
            <button
              className="flex relative items-center justify-center border border-[.5px] border-white-10 rounded-[8rem] p-8 bg-white-10"
              onClick={() => setOpen((prevState) => !prevState)}
            >
              <Image src={dotsIcon} size={24} />
            </button>
            {isOpen && (
              <div
                className={cx(s.bg, 'fixed inset-x-0 inset-y-0 z-0')}
                onClick={() => {
                  setOpen(false);
                }}
              />
            )}
            {isOpen && (
              <div
                className={cx(
                  s.dropdownWrapper,
                  'absolute z-10 right-0 top-[44rem] flex flex-col justify-start rounded-[8rem] gap-8 min-w-[140rem] border border-white-10 bg-white-5'
                )}
              >
                {/* <button
                  className={cx(
                    'flex justify-start items-center gap-8 cursor-pointer px-16 py-8',
                    !isPending && 'pointer-events-none opacity-50'
                  )}
                  onClick={() => {
                    startTransition(() => {
                      navigate(
                        `/${paths.TIMELINE}/${proposal.project._id}/edit-proposal/${proposal._id}`
                      );
                    });
                    setOpen(false);
                  }}
                  disabled={!isPending}
                >
                  <Image src={editIcon} size={20} />
                  <Text className="font-normal text-nowrap" message="Edit" size="m14" />
                </button> */}
                <button
                  className="flex justify-start items-center gap-8 cursor-pointer px-16 py-8"
                  onClick={() => {
                    const isDelete = confirm('Are you sure you want to delete this proposal?');

                    if (isDelete) {
                      onDeleteProposal(proposal._id);
                      setOpen(false);
                      handleNavigation();
                    } else {
                      setOpen(false);
                    }
                  }}
                >
                  <Image src={deleteIcon} size={20} />
                  <Text className="font-normal text-nowrap" message="Delete" size="m14" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-16 flex items-start sm:items-center pb-16 sm:border-b border-white-10">
        <div onClick={handleNavigation} className="cursor-pointer">
          <Avatar size={24} src={proposal.project.avatar} uniqueString={proposal.project._id} />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div onClick={handleNavigation} className="cursor-pointer hover:underline">
            <Text message={proposal.project.name} size="m14" className="ml-4" />
          </div>
          <span className="text-r14 text-regular ml-4 hidden sm:block">·</span>
          <Text
            color="regular"
            size="r14"
            message={isPending ? formatedStartDate : formatedEndDate}
            className="ml-4"
          />
          {isBitcredit && (
            <>
              <span className="text-r14 text-regular mx-4 hidden sm:block">·</span>
              {proposal.proposalType === 'contribution_proposal' && (
                <div className="flex items-center gap-4 px-4 sm:px-12 py-4 text-r12 sm:text-r14 text-[#FFA6E1] rounded-[8px] bg-[#FFA6E10D]">
                  <Image src={contributionIcon} size={16} />
                  Contribution proposal
                </div>
              )}
              {proposal.proposalType === 'delivery_acceptance' && (
                <div className="flex items-center gap-4 px-4 sm:px-12 py-4 text-r12 sm:text-r14 text-green rounded-[8px] bg-green-5">
                  <Image src={deliveryIcon} size={16} />
                  Delivery acceptance
                </div>
              )}
              {proposal.proposalType === 'strategic_decision' && (
                <div className="flex items-center gap-4 px-4 sm:px-12 py-4 text-r12 sm:text-r14 text-primary rounded-[8px] bg-primary-5">
                  <Image src={strategicIcon} size={16} />
                  Strategic decision
                </div>
              )}
            </>
          )}
          {isBitcredit && proposal.retryCount === 1 && (
            <>
              <span className="text-r14 text-regular mx-4 hidden sm:block">·</span>
              <div className="flex items-center gap-4 px-8 py-4 text-r12 rounded-[8px] bg-white-3">
                Refill
              </div>
            </>
          )}
          {!isPending && Boolean(proposal.quorumReached) && Boolean(proposal.project.quorum) && (
            <>
              <span className="text-r14 text-regular ml-8 hidden sm:block">·</span>
              <Text
                color={Number(proposal.quorumReached) < 100 ? 'red' : 'green'}
                size="r14"
                message={`${Number(proposal.quorumReached).toFixed(2)}% quorum reached`}
                className="ml-8"
              />
            </>
          )}
        </div>
        <StatusBadge isActive={isActive} isPending={isPending} />
      </div>
    </div>
  );
});
