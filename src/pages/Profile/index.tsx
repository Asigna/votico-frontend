import React from 'react';
import { useLocation } from 'react-router-dom';

import backIcon from '@images/back.svg';
import { Sidebar } from '@components';
import paths from '@constants/paths';

import { General } from './components/General';

import { Members } from './components/Members';
import { VotingSettings } from './components/VotingSettings';
import { ProposalSettings } from './components/ProposalSettings';
import useProfile from './utils/useProfile.ts';

export const Profile = React.memo(() => {
  const { project, setProject } = useProfile();
  const { pathname } = useLocation();

  if (!project) {
    return null;
  }

  let activeTab: 'general' | 'voting' | 'proposal' | 'members' = 'general';

  if (pathname === `/${paths.PROFILE}/${project._id}/members`) {
    activeTab = 'members';
  } else if (pathname === `/${paths.PROFILE}/${project._id}/voting`) {
    activeTab = 'voting';
  } else if (pathname === `/${paths.PROFILE}/${project._id}/proposal`) {
    activeTab = 'proposal';
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col sm:flex-row gap-32">
        <Sidebar
          backImage={backIcon}
          backTitle="Back"
          backUrl={`/${paths.TIMELINE}/${project._id}`}
          mainUrl={`${paths.PROFILE}/${project._id}`}
          items={[
            { name: 'General', _id: '' },
            { name: 'Voting', _id: 'voting' },
            { name: 'Proposal', _id: 'proposal' },
            { name: 'Members', _id: 'members' },
          ]}
          className="animate-bottom-top"
        />
        <div className="max-w-[708rem] w-full mx-auto gap-24 flex flex-col">
          {activeTab === 'general' && Boolean(project) && <General project={project} />}
          {activeTab === 'voting' && Boolean(project) && (
            <VotingSettings project={project} setProject={setProject} />
          )}
          {activeTab === 'proposal' && Boolean(project) && <ProposalSettings />}
          {activeTab === 'members' && Boolean(project) && <Members project={project} />}
        </div>
      </div>
    </div>
  );
});

Profile.displayName = 'Profile';
