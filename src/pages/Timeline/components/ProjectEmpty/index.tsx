import React, { startTransition, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Image, Modal, Text } from '@kit';
import monitorIcon from '@images/monitor.svg';
import paths from '@constants/paths.ts';
import { AddProjectModal } from '@components';

export const ProjectEmpty: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [isShowAddProject, setIsShowAddProject] = useState(false);

  const handleCreateProject = useCallback(() => {
    startTransition(() => {
      setIsShowAddProject(true);
    });
  }, []);

  const handleJoinProject = useCallback(() => {
    startTransition(() => {
      navigate(`/${paths.EXPLORE}`);
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-40 mt-[98rem]">
      <div className="flex flex-col items-center gap-24">
        <Image src={monitorIcon} size={40} />
        <Text size="m18" message="You haven’t joined any projects yet" className="text-center" />
      </div>
      <div className="flex items-center gap-16">
        <Button
          className="min-w-[112rem] sm:min-w-[159rem]"
          message="Join Projects"
          size="sm"
          colorType="secondary"
          onClick={handleJoinProject}
        />
        <Button
          className="min-w-[112rem] sm:min-w-[159rem]"
          message="Create Project"
          size="sm"
          onClick={handleCreateProject}
        />
      </div>
      <Modal onClose={() => setIsShowAddProject(false)} isShow={isShowAddProject}>
        <AddProjectModal />
      </Modal>
    </div>
  );
});

ProjectEmpty.displayName = 'ProjectEmpty';
