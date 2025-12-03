import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import useProjects from '@store/projects/useProjects.ts';
import { createProposal, NewProposal } from '@api/admin';
import paths from '@constants/paths';
import { getProjectById } from '@api/project.ts';
import { Project, Proposal } from '@/pages/utils/types';

const fetchProjectById = async (projectId?: string) => {
  if (!projectId) {
    return {};
  }

  const response = await getProjectById(projectId);
  return response?.data?.data || {};
};

const useCreateProposal = (proposal?: Proposal & { project: Project }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { myProjects } = useProjects();
  const selectedProject = myProjects.find((project) => project._id === projectId);
  const [project, setProject] = useState(selectedProject);
  const [isPublishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const project = await fetchProjectById(projectId);

      setProject(project);
    };

    if (!project) {
      fetch();
    }
  }, [project, projectId, proposal]);

  const initialStartDate = +new Date(new Date().getTime() + 1 * 60 * 1000);
  const initialEndDate = +new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 1 * 60 * 1000);
  const initialDeadlineDate = +new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    setError,
    control,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewProposal>({
    defaultValues: {
      projectId,
      isHiddenVotes: false,
      startDate: proposal?.startDate ? proposal?.startDate : initialStartDate,
      endDate: proposal?.endDate ? proposal?.endDate : initialEndDate,
      discussion: proposal?.discussion ? proposal?.discussion : '',
      votingType: proposal?.votingType
        ? proposal?.votingType
        : project?.type === 'bitcredit'
          ? 'basic'
          : 'single',
      options: proposal?.options ? proposal?.options : [],
      block: proposal?.block ? Number(proposal?.block) : 0,
      title: proposal?.title ? proposal?.title : '',
      text: proposal?.text ? proposal?.text : '',
      proposalType: proposal?.proposalType ? proposal?.proposalType : 'contribution_proposal',
      roadmap: proposal?.roadmap ? proposal?.roadmap : '',
      rewardRecipient: proposal?.rewardRecipient ? proposal?.rewardRecipient : '',

      nextMilestone: {
        deadline: proposal?.nextMilestone?.deadline
          ? proposal?.nextMilestone.deadline
          : initialDeadlineDate.toString(),
        deliverable: proposal?.nextMilestone?.deliverable
          ? proposal?.nextMilestone?.deliverable
          : '',
        rewardAmount: proposal?.nextMilestone?.rewardAmount
          ? proposal?.nextMilestone?.rewardAmount
          : '',
      },
      links: [
        {
          type: 'github_discussion',
          link: proposal?.links?.find((l) => l.type === 'github_discussion')?.link ?? '',
        },
        {
          type: 'proposal',
          link: proposal?.links?.find((l) => l.type === 'proposal')?.link ?? '',
        },
      ],
    },
  });

  const votingType = watch('votingType');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const titleValue = watch('title');
  const textAreaValue = watch('text');
  const roadmapValue = watch('roadmap');
  const deliverableValue = watch('nextMilestone.deliverable');
  const deadline = watch('nextMilestone.deadline');
  const proposalTypeValue = watch('proposalType');

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const formData = getValues();

      if (project?.type === 'bitcredit') {
        formData.votingType = 'basic';
        const hundredYearsMs = 3 * 24 * 60 * 60 * 1000;

        const now = Date.now();
        const threeHoursLater = now + 3 * 60 * 60 * 1000;

        if (Number(deadline) < threeHoursLater) {
          setError('nextMilestone.deadline', {
            type: 'manual',
            message: 'Wrong Deadline',
          });
          return;
        }

        formData.endDate = formData.startDate + hundredYearsMs;

        const link1 = formData.links?.[0]?.link?.trim();
        const link2 = formData.links?.[1]?.link?.trim();

        if (formData.proposalType === 'delivery_acceptance' && (!link1 || !link2)) {
          setError('links', {
            type: 'manual',
            message: '2You need to enter both links',
          });
          return;
        }

        if (!link1) {
          setError('links', {
            type: 'manual',
            message: '0Must be a valid GitHub URL',
          });
          return;
        }

        if (link1 && !/^https:\/\/(www\.)?github\.com\/.+/.test(link1)) {
          setError('links', {
            type: 'manual',
            message: '0Must be a valid GitHub URL',
          });
          return;
        }
        if (link2 && !/^https:\/\/([a-zA-Z0-9-]+\.)*voti\.co\/.+/.test(link2)) {
          setError('links', {
            type: 'manual',
            message: '1Must be a valid voti.co URL',
          });
          return;
        }
        formData.links = formData.links?.filter((l) => l?.link?.trim());

        if (formData.proposalType === 'strategic_decision') {
          delete formData.nextMilestone;
          delete formData.rewardRecipient;
          delete formData.roadmap;
        }
        if (formData.proposalType === 'contribution_proposal') {
          delete formData.rewardRecipient;
        }
      } else {
        delete formData.links;
        delete formData.nextMilestone;
        delete formData.rewardRecipient;
        delete formData.roadmap;
      }

      const response = await createProposal(formData);

      if (response?.data?.data) {
        startTransition(() => {
          navigate(`/${paths.PROPOSAL}/${response.data.data._id}`);
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError('root', {
          type: 'create',
          message: error.response?.data.message,
        });
      }
    } finally {
      setPublishing(false);
    }
  }, [getValues, project?.type, deadline, setError, navigate]);

  useEffect(() => {
    if (!(project?.roles?.includes('admin') || project?.roles?.includes('author'))) {
      setError('root', {
        type: 'add',
        message: 'You do not have role permissions in this project to create proposals',
      });
    } else {
      clearErrors('root');
    }
  }, [clearErrors, navigate, project, projectId, setError]);

  const goBack = useCallback(() => {
    startTransition(() => {
      navigate(`/${paths.TIMELINE}/${projectId}`);
    });
  }, [navigate, projectId]);

  useEffect(() => {
    if (proposal) {
      reset({
        projectId,
        isHiddenVotes: false,
        startDate: proposal.startDate,
        endDate: proposal.endDate,
        discussion: proposal.discussion,
        votingType: proposal.votingType,
        options: proposal.options,
        block: Number(proposal.block),
        title: proposal.title,
        text: proposal.text,
      });
    }
  }, [projectId, proposal, reset]);

  return useMemo(
    () => ({
      project,
      goBack,
      register,
      errors,
      trigger,
      control,
      clearErrors,
      votingType,
      handlePublish: handleSubmit(handlePublish),
      startDate,
      endDate,
      titleValue,
      textAreaValue,
      isPublishing,
      deliverableValue,
      roadmapValue,
      proposalTypeValue,
    }),
    [
      project,
      goBack,
      register,
      errors,
      trigger,
      control,
      clearErrors,
      votingType,
      handleSubmit,
      handlePublish,
      startDate,
      endDate,
      titleValue,
      textAreaValue,
      isPublishing,
      deliverableValue,
      roadmapValue,
      proposalTypeValue,
    ]
  );
};

export default useCreateProposal;
