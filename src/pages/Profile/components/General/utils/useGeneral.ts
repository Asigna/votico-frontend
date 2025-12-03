import { useCallback, useMemo } from 'react';
import { useForm, useFormState } from 'react-hook-form';

import { changeProjectInfo, ProjectInfo } from '@api/admin';
import { Project } from '@pages/utils/types';
import paths from '@constants/paths.ts';

const useGeneral = (project: Project) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
  } = useForm<ProjectInfo>({
    defaultValues: {
      _id: project._id,
      name: project.name || '',
      about: project.about || '',
      website: project.website || '',
      termsLink: project.termsLink || '',
      tags: project.tags || [],
      isHidden: !!project.isHidden,
      socials: {
        twitter: project.socials?.twitter || '',
        github: project.socials?.github || '',
        coingecko: project.socials?.coingecko || '',
        telegram: project.socials?.telegram || '',
        discord: project.socials?.discord || '',
      },
    },
  });
  const { isDirty } = useFormState({ control });
  const textAreaValue = watch('about');

  const onSubmit = useCallback(async () => {
    const result = await changeProjectInfo(getValues());

    if (result?.data?.data) {
      window.location.href = `/${paths.TIMELINE}/${project?._id}`;
    }
  }, [getValues, project?._id]);

  return useMemo(
    () => ({ textAreaValue, onSubmit, register, handleSubmit, control, errors, reset, isDirty }),
    [textAreaValue, onSubmit, register, handleSubmit, control, errors, reset, isDirty]
  );
};

export default useGeneral;
