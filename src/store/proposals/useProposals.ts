import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { atom, useAtom } from 'jotai';
import { useForm } from 'react-hook-form';

import { Project, Proposal } from '@pages/utils/types';
import { getProposalListByProjectId, getProposalList, SearchProposalInfo } from '@api/proposal.ts';
import { getProjectById } from '@api/project.ts';
import useProjects from '@store/projects/useProjects';
import { statutes } from '@types';
import { debounce } from '@utils';

export const PROPOSALS_BY_PAGE = 10;

type ProposalResponse = {
  data: Proposal[];
  pagination: { count: number; limit: number; page: number };
};

const proposalsAtom = atom<ProposalResponse>({
  data: [],
  pagination: { count: 0, limit: PROPOSALS_BY_PAGE, page: 0 },
});

const projectAtom = atom<Project>({
  _id: '',
  avatar: '',
  name: '',
  membersCount: 0,
  isMember: false,
  about: '',
  tags: [],
  role: 'member',
  roles: [],
});

const fetchProjectById = async (projectId?: string) => {
  if (!projectId) {
    return {};
  }

  const response = await getProjectById(projectId);
  return response?.data?.data || {};
};

const fetchProposalList = async (projectId?: string, status?: string, name?: string) => {
  if (!projectId) {
    const response = await getProposalList({
      page: 0,
      limit: PROPOSALS_BY_PAGE,
      status,
      name,
    });
    return {
      data: response?.data?.data || [],
      pagination: response?.data?.pagination || {},
    };
  }

  const response = await getProposalListByProjectId(projectId, {
    page: 0,
    limit: PROPOSALS_BY_PAGE,
    status,
    name,
  });

  return {
    data: response?.data?.data || [],
    pagination: response?.data?.pagination || {},
  };
};

const useProposals = () => {
  const { myProjects, handleChangeIsMemberStatus } = useProjects();
  const { projectId } = useParams();
  const [searchTitle, setSearchTitle] = useState('');
  const [project, setProject] = useAtom(projectAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useAtom(proposalsAtom);

  const { register, control, getValues, watch, reset } = useForm<SearchProposalInfo>({
    defaultValues: {
      name: '',
      status: statutes[0],
    },
  });
  const nameValue = watch('name');
  const statusValue = watch('status');

  const debounceRef = useRef(debounce(setSearchTitle, 450));
  useEffect(() => {
    debounceRef.current(nameValue);
  }, [nameValue]);

  useEffect(() => {
    reset();
  }, [projectId, reset]);

  useEffect(() => {
    const status = Array.isArray(statusValue) ? statusValue[0] : statusValue;
    setIsLoading(true);
    const fetch = async () => {
      const proposalList = await fetchProposalList(
        projectId,
        status === 'All' ? '' : status.toLowerCase(),
        searchTitle
      );
      const project = await fetchProjectById(projectId);

      setProject(project);
      setProposals(proposalList);
      setIsLoading(false);
    };

    fetch();
  }, [projectId, searchTitle, statusValue, setProject, setProposals]);

  const isMember = project.roles?.includes('member');

  const updatedProposals = proposals.data.map((proposal) => ({
    ...proposal,
  }));
  const updatedProject = { ...project, isMember };

  const calculateIsShowPagination = ({ page, limit, count }: ProposalResponse['pagination']) => {
    return (page + 1) * limit < count;
  };

  const isShowPagination = calculateIsShowPagination(proposals.pagination);

  const handleLoadMoreProposals = useCallback(async () => {
    let response;

    if (!projectId) {
      response = await getProposalList({
        page: proposals.pagination.page + 1,
        limit: PROPOSALS_BY_PAGE,
      });
    } else {
      response = await getProposalListByProjectId(projectId, {
        page: proposals.pagination.page + 1,
        limit: PROPOSALS_BY_PAGE,
      });
    }

    setProposals({
      data: [...proposals.data, ...(response?.data?.data || [])],
      pagination: response?.data?.pagination || {},
    });
  }, [projectId, proposals.data, proposals.pagination.page, setProposals]);

  const handleLeaveJoinMember = useCallback(
    async (projectId: string, isMember: boolean) => {
      await handleChangeIsMemberStatus(projectId, isMember);
      const response = await getProjectById(projectId);
      setProject(response?.data?.data || {});
    },
    [handleChangeIsMemberStatus, setProject]
  );

  return useMemo(
    () => ({
      isLoading,
      proposals: updatedProposals,
      myProjects,
      project: updatedProject,
      setProposals,
      setIsLoading,
      isShowPagination,
      handleLoadMoreProposals,
      handleLeaveJoinMember,
      searchTitle,
      setSearchTitle,
      register,
      control,
      getValues,
      watch,
      reset,
    }),
    [
      isLoading,
      myProjects,
      proposals,
      project,
      setProposals,
      isShowPagination,
      handleLoadMoreProposals,
      handleLeaveJoinMember,
      searchTitle,
      register,
      control,
      getValues,
      watch,
      reset,
    ]
  );
};

export default useProposals;
