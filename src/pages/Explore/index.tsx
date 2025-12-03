import React, { useCallback, useRef, useState } from 'react';

import { random, debounce } from '@utils';
import filterIcon from '@images/filter.svg';
import useProjects from '@store/projects/useProjects';
import { Button, Dropdown, Input, Modal, Text } from '@kit';
import { AddProjectModal } from '@components';

import { zoomIcon } from './utils/images';
import { AddProjectButton } from './components/AddProjectButton';
import { ProjectItem, SkeletonProjectItem } from './components/ProjectItem';

const filters: string[] = ['All categories', 'Joined'];

export const Explore = React.memo(() => {
  const {
    projects,
    getProjectByName,
    isLoading,
    handleChangeIsMemberStatus,
    isShowPagination,
    handleLoadMoreProjectrs,
  } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>(filters[0]);
  const [isShowAddProject, setIsShowAddProject] = useState(false);

  const debounceRef = useRef(debounce(getProjectByName, 300));

  const handleChangeSearchInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    debounceRef.current(event.target.value);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse sm:flex-row justify-between animate-bottom-top sm:items-center gap-y-24">
        <Text
          message={`${projects.filter((project) => (selectedCategory === 'Joined' ? project.isMember : true)).length} Projects`}
          size="m16"
        />
        <div className="flex flex-1 items-center gap-16 sm:gap-32 justify-end">
          <Input
            placeholder="Search"
            leftIcon={zoomIcon}
            className="max-w-[456rem] flex-1"
            onChange={handleChangeSearchInput}
          />
          <Dropdown
            selected={[selectedCategory]}
            items={filters}
            onChange={(val) => setSelectedCategory(Array.isArray(val) ? val[0] : val)}
            placeHolder="Please select"
            className="sm:w-[212rem]"
            leftIcon={filterIcon}
            mobileView
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex gap-32 flex-wrap w-full mt-16 sm:mt-32">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonProjectItem key={`${index}-${index}`} isFilled={Boolean(random(0, 1))} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:flex gap-12 sm:gap-32 flex-wrap w-full mt-16 sm:mt-32">
          <AddProjectButton onClick={() => setIsShowAddProject(true)} />
          {projects
            .filter((project) => (selectedCategory === 'Joined' ? project.isMember : true))
            .map((project) => (
              <ProjectItem
                key={project._id}
                {...project}
                onClickButton={handleChangeIsMemberStatus}
              />
            ))}
        </div>
      )}
      {isShowPagination && (
        <Button
          colorType="secondary"
          message="Load more"
          className="mx-auto mt-32"
          onClick={handleLoadMoreProjectrs}
        />
      )}
      <Modal onClose={() => setIsShowAddProject(false)} isShow={isShowAddProject}>
        <AddProjectModal />
      </Modal>
    </div>
  );
});

Explore.displayName = 'Explore';
