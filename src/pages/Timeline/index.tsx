import React, { startTransition, useCallback } from 'react';
import cx from 'classnames';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Controller } from 'react-hook-form';

import { statutes } from '@types';
import paths from '@constants/paths';
import { Button, Dropdown, Input } from '@kit';
import { Sidebar } from '@components';
import useProposals from '@store/proposals/useProposals.ts';
import { ProposalList } from '@pages/Timeline/components/ProposalList';
import { useAddress } from '@store';
import zoomIcon from '@images/zoom.svg';
import filterIcon from '@images/filter.svg';

import { About } from './components/About';
import { Assets } from './components/Assets';
import { ProjectInfo } from './components/ProjectInfo';
import { exploreIcon, joinedIcon } from './utils/images';
import { ProjectEmpty } from './components/ProjectEmpty';
import { TabList, type TabListProps } from './components/TabList';

export const Timeline = React.memo(() => {
  const { address } = useAddress();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    proposals,
    isLoading,
    project,
    myProjects,
    handleLeaveJoinMember,
    setIsLoading,
    isShowPagination,
    handleLoadMoreProposals,
    register,
    control,
  } = useProposals();
  const { projectId } = useParams();

  const isSelectedProject = !!projectId && !!project._id;

  let activeTab: TabListProps['activeTab'] = 'proposal';

  if (pathname === `/${paths.TIMELINE}/${projectId}/about`) {
    activeTab = 'about';
  } else if (pathname === `/${paths.TIMELINE}/${projectId}/assets`) {
    activeTab = 'assets';
  }

  const handleNavigateToNewProposal = useCallback(() => {
    startTransition(() => {
      navigate(`/${paths.TIMELINE}/${projectId}/create-proposal`);
    });
  }, [navigate, projectId]);

  const handleSidebarClick = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  return (
    <div className="w-full flex gap-16 sm:gap-32 flex-col sm:flex-row">
      {Boolean(address) && (
        <Sidebar
          items={[{ _id: '', name: 'Joined projects', avatar: joinedIcon }, ...myProjects]}
          backUrl={`/${paths.EXPLORE}`}
          backTitle="All projects"
          backImage={exploreIcon}
          mainUrl={paths.TIMELINE}
          onClickItem={handleSidebarClick}
          className={cx('animate-bottom-top', isLoading ? 'pointer-events-none opacity-60' : '')}
        />
      )}
      <div className="w-full">
        <div
          className={cx(
            'max-w-[708rem] w-full mx-auto gap-16 flex flex-col animate-bottom-top',
            isLoading ? 'pointer-events-none opacity-60' : ''
          )}
        >
          <div className="flex flex-col gap-24 justify-between">
            {isSelectedProject && (
              <>
                <ProjectInfo project={project} onClickButton={handleLeaveJoinMember} />
                <div className="flex flex-1 items-center gap-16 sm:gap-32">
                  <TabList activeTab={activeTab} />
                </div>
              </>
            )}
            {activeTab === 'proposal' && (
              <div className="flex flex-1 items-center gap-16 justify-between flex-wrap">
                <Input
                  placeholder="Search"
                  leftIcon={zoomIcon}
                  className="min-w-[122rem] flex-1"
                  {...register('name')}
                />
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Dropdown
                      selected={[field.value]}
                      items={statutes}
                      placeHolder="Please select"
                      onChange={(newSelected) => {
                        field.onChange(newSelected);
                      }}
                      className="sm:w-[200rem]"
                      leftIcon={filterIcon}
                      mobileView
                    />
                  )}
                />

                {isSelectedProject && Boolean(address) && (
                  <Button
                    onClick={handleNavigateToNewProposal}
                    colorType="primary"
                    className="w-full sm:max-w-[188rem] ml-auto order-0 order-first sm:order-last"
                    message="New proposal"
                  />
                )}
              </div>
            )}
          </div>
          {!isLoading && myProjects.length === 0 && !isSelectedProject && Boolean(address) && (
            <ProjectEmpty />
          )}
          {activeTab === 'proposal' && (Boolean(address) || !address) && (
            <ProposalList isLoading={isLoading} proposals={proposals} />
          )}
          {!isLoading && activeTab === 'proposal' && isShowPagination && (
            <Button
              colorType="secondary"
              message="Load more"
              className="mx-auto"
              onClick={handleLoadMoreProposals}
            />
          )}
          {activeTab === 'about' && isSelectedProject && <About project={project} />}
          {activeTab === 'assets' && isSelectedProject && (
            <Assets strategies={project.strategies} />
          )}
        </div>
      </div>
      {Boolean(address) && <div className="max-w-[212rem] h-full flex-1" />}
    </div>
  );
});

Timeline.displayName = 'Timeline';
