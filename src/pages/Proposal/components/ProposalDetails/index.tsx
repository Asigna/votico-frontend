import React from 'react';

import { Button, Image, Text } from '@kit';
import { Project, Proposal } from '@pages/utils/types';

import external from '@images/external.svg';
import githubImage from '@images/logo/github.png';
import voticoImage from '@images/logo/votico.png';
import { AddressLink } from '@components';
import { format } from 'date-fns';

type ProposalHeadProps = {
  proposal: Proposal & { project: Project };
  className?: string;
};

export const ProposalDetails: React.FC<ProposalHeadProps> = React.memo((props) => {
  const { proposal, className } = props;

  const githubLink = proposal?.links?.find((l) => l.type === 'github_discussion')?.link ?? '';
  const proposalLink = proposal?.links?.find((l) => l.type === 'proposal')?.link ?? '';

  // if (proposal.proposalType === 'common' || proposal.proposalType === 'strategic_decision') return <></>;

  return (
    <div className={className}>
      <Text message="Proposal details" size="b32" sizeSm="s22" />
      {proposal.proposalType !== 'strategic_decision' && (
        <div className="flex flex-col gap-8 rounded-[8px] bg-white-3 p-20 mt-16">
          <Text message="Next Deliverable" size="m14" color="regular" />
          <div className="grid grid-cols-[120px_auto] gap-x-16 gap-y-8">
            <Text message="Deadline:" size="r14" color="regular" />
            <Text
              message={
                format(
                  new Date(Number(proposal.nextMilestone?.deadline || '0')),
                  'MMM dd, yyyy, h:mm a'
                ) ?? '-'
              }
              size="r14"
            />
            {proposal.nextMilestone?.rewardAmount && (
              <Text message="Reward amount:" size="r14" color="regular" />
            )}
            {proposal.nextMilestone?.rewardAmount && (
              <Text message={`${proposal.nextMilestone?.rewardAmount} e-IOU` || '-'} size="r14" />
            )}
            {proposal.rewardRecipient && (
              <Text message="Reward recipient" size="r14" color="regular" />
            )}
            {proposal.rewardRecipient && (
              <AddressLink address={proposal.rewardRecipient || '-'} isAddress isLeft />
            )}
            <Text message="Deliverable:" size="r14" color="regular" />
            <Text
              message={proposal.nextMilestone?.deliverable || '-'}
              size="r14"
              className="break-all"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-20 mt-24">
        {proposal.roadmap && (
          <div className="flex flex-col gap-8">
            <Text message="Roadmap" size="r14" color="regular" />
            <Text message={proposal.roadmap} size="m14" className="break-all" />
          </div>
        )}
        {Boolean(githubLink) && (
          <div className="flex flex-col gap-8">
            <Text message="Link to the associated GitHub discussion" size="r14" color="regular" />
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-[8px] bg-white-3 px-12 sm:px-24 py-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <Image src={githubImage} size={24} />
                <div className="flex flex-col items-center sm:items-start gap-4">
                  <Text message="GitHub" size="m14" />
                  <Text
                    message={githubLink}
                    size="m14"
                    sizeSm="r12"
                    color="primary"
                    className="break-all truncate max-w-[270px] sm:max-w-[460px]"
                  />
                </div>
              </div>
              <Button
                message="Open"
                size="md"
                className=""
                leftIcon={external}
                colorIcon="white"
                onClick={() => window.open(githubLink, '_blank')}
                colorType="secondary"
              />
            </div>
          </div>
        )}
        {proposalLink && (
          <div className="flex flex-col gap-8">
            <Text message="Link to the related previous proposal" size="r14" color="regular" />
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-[8px] bg-white-3 px-12 sm:px-24 py-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <Image src={voticoImage} size={24} />
                <div className="flex flex-col items-center sm:items-start gap-4">
                  <Text message="Votico" size="m14" />
                  <Text
                    message={proposalLink}
                    size="m14"
                    sizeSm="r12"
                    color="primary"
                    className="break-all truncate max-w-[270px] sm:max-w-[460px]"
                  />
                </div>
              </div>
              <Button
                message="Open"
                size="md"
                className=""
                leftIcon={external}
                colorIcon="white"
                onClick={() => window.open(proposalLink, '_blank')}
                colorType="secondary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
