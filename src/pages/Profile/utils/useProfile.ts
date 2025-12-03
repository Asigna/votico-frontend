import { startTransition, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Project } from '@pages/utils/types';
import { getProjectById } from '@api/project.ts';
import paths from '@constants/paths';

const fetchProjectById = async (projectId?: string): Promise<Project> => {
  if (!projectId) {
    return {
      _id: '',
      about: '',
      avatar: '',
      isMember: false,
      membersCount: 0,
      name: '',
      role: 'member',
      roles: ['member'],
      tags: [],
    };
  }

  const response = await getProjectById(projectId);
  return response?.data?.data || {};
};

const useProfile = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const project = await fetchProjectById(projectId);
      setProject(project);
    };

    fetch();
  }, [projectId]);

  useEffect(() => {
    if (project && !project.roles?.includes('admin')) {
      startTransition(() => {
        navigate(`/${paths.TIMELINE}/${project._id}`);
      });
    }
  }, [navigate, project]);

  return useMemo(() => ({ project, setProject }), [project]);
};

export default useProfile;
