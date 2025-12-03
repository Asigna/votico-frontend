import { atom, useAtom } from 'jotai';
import { useCallback, useMemo, useState, useEffect } from 'react';

import { Project } from '@pages/utils/types';
import { getMyProjects, getProjects } from '@api/project';

export const PROJECTS_BY_PAGE = 10;

type ProjectResponse = {
  data: Project[];
  pagination: { count: number; limit: number; page: number };
};

const handleGetProjects = async () => {
  const response = await getProjects({
    page: 0,
    limit: PROJECTS_BY_PAGE,
  });
  return {
    data: response?.data?.data || [],
    pagination: response?.data?.pagination || {},
  };
};

const handleGetMyProjects = async () => {
  const response = await getMyProjects();
  return response?.data?.data || [];
};

const projectAtom = atom<ProjectResponse>({
  data: [],
  pagination: { count: 0, limit: PROJECTS_BY_PAGE, page: 0 },
});
const myProjectAtom = atom<Project[]>([]);

const useProjects = () => {
  const [projects, setProjects] = useAtom(projectAtom);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectsBySearchValue, setProjectsBySearchValue] = useState([]);
  const [myProjects, setMyProjects] = useAtom(myProjectAtom);

  useEffect(() => {
    const fetch = async () => {
      if (!projects.data.length && !myProjects.length) {
        const projectList = await handleGetProjects();
        const myProjectList = await handleGetMyProjects();
        setProjects(projectList);
        setMyProjects(myProjectList);
      }
    };

    fetch();
  }, []);

  const getProjectByName = useCallback(async (name: string) => {
    setIsLoading(true);
    setSearchValue(name);
    const response = await getProjects({
      page: 0,
      limit: PROJECTS_BY_PAGE,
      name,
    });

    if (response?.data?.data) {
      setProjectsBySearchValue(response.data.data);
    } else {
      setProjectsBySearchValue([]);
    }

    setIsLoading(false);
  }, []);

  const extendedProjects = useMemo(() => {
    const currentProjects = searchValue ? projectsBySearchValue : projects.data;
    const myProjectIds = new Set(
      myProjects
        .filter((project) => project.roles?.includes('member'))
        .map((project) => project._id)
    );
    return currentProjects.map((project) => ({
      ...project,
      isMember: myProjectIds.has(project._id),
    }));
  }, [searchValue, projectsBySearchValue, projects.data, myProjects]);

  const handleChangeIsMemberStatus = useCallback(
    (projectId: string, isMember: boolean) => {
      setMyProjects((currentProjects) => {
        if (isMember) {
          const projectExists = currentProjects.some((project) => project._id === projectId);
          const foundProject = projects.data.find((project) => project._id === projectId);

          if (projectExists) {
            return currentProjects.map((project) =>
              project._id === projectId
                ? { ...project, roles: [...project.roles, 'member'] }
                : project
            );
          } else if (foundProject) {
            return [...currentProjects, { ...foundProject, isMember, roles: ['member'] }];
          }
          return currentProjects;
        } else {
          return currentProjects
            .filter((project) => {
              if (
                project._id === projectId &&
                project.roles.length === 1 &&
                project.roles[0] === 'member'
              ) {
                return false;
              }
              return true;
            })
            .map((project) => {
              if (project._id === projectId && project.roles?.includes('member')) {
                return {
                  ...project,
                  roles: project.roles.filter((role) => role !== 'member'),
                };
              }
              return project;
            });
        }
      });

      setProjects((projects) => {
        return {
          data: projects.data.map((project) =>
            project._id !== projectId
              ? project
              : {
                  ...project,
                  membersCount: isMember ? project.membersCount + 1 : project.membersCount - 1,
                  isMember: !isMember,
                }
          ),
          pagination: projects.pagination,
        };
      });
    },
    [projects.data, setMyProjects, setProjects]
  );

  const calculateIsShowPagination = ({ page, limit, count }: ProjectResponse['pagination']) => {
    return (page + 1) * limit < count;
  };

  const isShowPagination = calculateIsShowPagination(projects.pagination);

  const handleLoadMoreProjectrs = useCallback(async () => {
    const response = await getProjects({
      page: projects.pagination.page + 1,
      limit: PROJECTS_BY_PAGE,
    });

    setProjects({
      data: [...projects.data, ...(response?.data?.data || [])],
      pagination: response?.data?.pagination || {},
    });
  }, [projects.data, projects.pagination.page, setProjects]);

  return useMemo(
    () => ({
      projects: extendedProjects,
      isShowPagination,
      isLoading,
      setProjects,
      myProjects,
      getProjectByName,
      handleChangeIsMemberStatus,
      handleLoadMoreProjectrs,
    }),
    [
      extendedProjects,
      isShowPagination,
      isLoading,
      setProjects,
      myProjects,
      getProjectByName,
      handleChangeIsMemberStatus,
      handleLoadMoreProjectrs,
    ]
  );
};

export default useProjects;
