import React, { useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import { isFuture, isPast } from 'date-fns';

import { Text } from '@kit';
import { Avatar } from '@components';

import useProposal from './utils/useProposal.ts';
import { Voting } from './components/Voting';
import { VoterList } from './components/VoterList';
import { InfoBlock } from './components/InfoBlock';
import { SkeletonProposal } from './components/SkeletonProposal/index.tsx';
import { ProposalHead } from './components/ProposalHead/index.tsx';
import { ProposalDetails } from './components/ProposalDetails/index.tsx';
import { PaticipantsList } from './components/PaticipantsList/index.tsx';

export const Proposal: React.FC = React.memo(() => {
  const {
    proposal,
    fetchProposal,
    onDeleteProposal,
    paticipants,
    isLoadingPaticipants,
    paticipantsRefill,
  } = useProposal();

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  if (!proposal) {
    return (
      <div className="w-full animate-bottom-top">
        <div className="w-full flex gap-16 md:gap-32 flex-col sm:flex-row-reverse">
          <div className="w-full sm:max-w-[334rem] h-full w-full">
            <InfoBlock />
          </div>
          <div className="max-w-[702rem] mx-auto pb-12 w-full">
            <SkeletonProposal />
          </div>
          <div className="max-w-[334rem] h-full flex-1"></div>
        </div>
      </div>
    );
  }

  const isActive = !isPast(new Date(proposal.endDate));
  const isPending = isFuture(new Date(proposal.startDate));
  const isBitcredit = proposal.project.type === 'bitcredit';
  const isCompleted = !isActive && !(isPending || !proposal.isBlockReleased);

  return (
    <div className="w-full animate-bottom-top">
      <div className="w-full flex gap-16 md:gap-32 flex-col sm:flex-row-reverse">
        <div className="w-full sm:max-w-[334rem] h-full w-full">
          <ProposalHead
            proposal={proposal}
            isActive={isActive}
            isPending={isPending || !proposal.isBlockReleased}
            className="block sm:hidden"
            onDeleteProposal={onDeleteProposal}
          />
          <InfoBlock proposal={proposal} isCompleted={isCompleted} />
        </div>
        <div className="max-w-[702rem] mx-auto pb-12 w-full">
          <ProposalHead
            proposal={proposal}
            isActive={isActive}
            isPending={isPending || !proposal.isBlockReleased}
            className="hidden sm:block"
            onDeleteProposal={onDeleteProposal}
            full
          />
          <Text message="Abstract" size="b32" sizeSm="s22" className="mt-24" />
          {isBitcredit ? (
            <div className="markdown-body sm:my-24">
              <Text message={proposal.text} size="r14" className="" />
            </div>
          ) : (
            <div className="markdown-body sm:my-24">
              <Markdown remarkPlugins={[remarkGfm]}>{proposal.text}</Markdown>
            </div>
          )}
          {isBitcredit && <ProposalDetails proposal={proposal} />}
          {Boolean(proposal.discussion) && (
            <div className="mt-16 sm:mt-32">
              <Text message="Discussion" size="b32" sizeSm="s22" />
              <a
                href={proposal.discussion}
                target="_blank"
                className="mt-16 bg-white-3 flex p-24 rounded-[8rem] hover:bg-white-5 transition"
              >
                <Avatar uniqueString={proposal._id} src={proposal.project.avatar} size={40} />
                <div className="flex flex-col ml-12">
                  <Text
                    message={
                      proposal.title.slice(0, 80) + (proposal.title.length > 80 ? '...' : '')
                    }
                    size="s16"
                  />

                  <div className="text-r14 text-regular">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {proposal.text.slice(0, 80) + (proposal.text.length > 80 ? '...' : '')}
                    </Markdown>
                  </div>
                </div>
              </a>
            </div>
          )}
          <Voting proposal={proposal} fetchProposal={fetchProposal} paticipants={paticipants} />

          {(!isBitcredit || isCompleted) && (
            <VoterList voterList={proposal.voterList} isBitcredit={isBitcredit} />
          )}
          {isBitcredit && !(isPending || !proposal.isBlockReleased) && (
            <PaticipantsList
              paticipants={paticipants}
              loading={isLoadingPaticipants}
              refilList={paticipantsRefill}
              voters={proposal.voterList}
              holdersCount={proposal.bitcreditHoldersCount || 0}
            />
          )}
        </div>
        <div className="max-w-[334rem] h-full flex-1"></div>
      </div>
    </div>
  );
});
