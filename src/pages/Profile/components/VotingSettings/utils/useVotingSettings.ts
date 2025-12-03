import { useCallback, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';

import { deleteProjectQuorum, insertProjectStrategies } from '@api/admin';
import { Project } from '@/pages/utils/types';

const insertStrategy = async (_id: string, quorumThreshold: number): Promise<Project> => {
  const response = await insertProjectStrategies(_id, quorumThreshold);
  return response?.data?.data || {};
};

const deleteQuorum = async (_id: string): Promise<Project> => {
  const response = await deleteProjectQuorum(_id);
  return response?.data?.data || {};
};

const useVotingSettings = (project: Project, setProject: (project: Project) => void) => {
  const [isQuorum, setQuorum] = useState(project.quorum || false);
  const [strategies, setStrategies] = useState(project.strategies);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
    reset,
    control,
    trigger,
  } = useForm({
    defaultValues: {
      weightQuorum: Number(project.quorumThreshold) || 0,
      strategies: project.strategies || [],
      toggle: isQuorum,
    },
  });
  const { isDirty } = useFormState({ control });
  const weightQuorumValue = watch('weightQuorum');

  const onSubmit = useCallback(async () => {
    const newWeight = isQuorum ? Number(weightQuorumValue) : 0;

    if (isQuorum) {
      const result = await insertStrategy(project._id, newWeight);
      setProject({ ...project, quorum: result.quorum, quorumThreshold: result.quorumThreshold });
    } else {
      const result = await deleteQuorum(project._id);
      setProject({ ...project, quorum: result.quorum, quorumThreshold: result.quorumThreshold });
    }
    reset(watch(), { keepValues: false, keepDirty: false, keepDefaultValues: false });
  }, [isQuorum, project, reset, setProject, watch, weightQuorumValue]);

  return useMemo(
    () => ({
      onSubmit,
      isQuorum,
      setQuorum,
      strategies,
      setStrategies,
      weightQuorumValue,
      reset,
      getValues,
      handleSubmit,
      errors,
      register,
      isDirty,
      trigger,
      control,
    }),
    [
      onSubmit,
      isQuorum,
      strategies,
      weightQuorumValue,
      reset,
      getValues,
      handleSubmit,
      errors,
      register,
      isDirty,
      trigger,
      control,
    ]
  );
};

export default useVotingSettings;
