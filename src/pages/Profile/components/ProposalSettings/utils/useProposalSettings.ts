import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { ProposalSettingsData } from '@/api/admin';

const useProposalSettings = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<ProposalSettingsData>({
    defaultValues: {
      minPower: 0,
      isEnableGuest: true,
    },
  });
  const isEnableGuest = watch('isEnableGuest');

  const onSubmit = useCallback(async () => {}, []);

  return useMemo(
    () => ({ control, errors, register, reset, handleSubmit, onSubmit, isEnableGuest }),
    [control, errors, register, reset, handleSubmit, onSubmit, isEnableGuest]
  );
};

export default useProposalSettings;
