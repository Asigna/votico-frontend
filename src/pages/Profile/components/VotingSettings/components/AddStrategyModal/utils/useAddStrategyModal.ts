import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Strategy } from '@/pages/utils/types';

const strategyList = ['WEIGHTED', 'WHITELIST', 'TICKET'] as const;
const standardTokens = ['BRC-20', 'Runes', 'Ordinals'];

const useAddStrategyModal = (strategy: Strategy | null) => {
  const { projectId } = useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<
    Strategy & {
      network: string;
    }
  >({
    defaultValues: {
      network: 'Bitcoin',
      whitelist: strategy?.whitelist || [],
      asset: strategy?.asset || undefined,
      weight: strategy?.weight || 0,
      strategy: strategy?.strategy || 'WEIGHTED',
    },
  });
  const selectedStrategy = watch('strategy');

  const handleAddStrategy = useCallback(() => {
    console.log('projectId', projectId, getValues());
  }, [projectId]);

  return useMemo(
    () => ({
      strategyList,
      standardTokens,
      selectedStrategy,
      handleAddStrategy,
      register,
      handleSubmit,
      control,
      errors,
      reset,
      setValue,
    }),
    [selectedStrategy, handleAddStrategy, register, handleSubmit, control, errors, reset, setValue]
  );
};

export default useAddStrategyModal;
