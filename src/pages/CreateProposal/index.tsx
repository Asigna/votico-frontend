import React, { startTransition, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Text } from '@kit';
import paths from '@constants/paths.ts';
import { Avatar } from '@components';

import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import useCreateProposal from './utils/useCreateProposal.ts';
import useProposal from '../Proposal/utils/useProposal.ts';

export const CreateProposal: React.FC = React.memo(() => {
  const [step, setStep] = useState(1);
  const { proposal } = useProposal();
  const { proposalId } = useParams();
  const {
    project,
    goBack,
    control,
    votingType,
    register,
    trigger,
    errors,
    handlePublish,
    clearErrors,
    startDate,
    endDate,
    titleValue,
    textAreaValue,
    isPublishing,
    deliverableValue,
    roadmapValue,
    proposalTypeValue,
  } = useCreateProposal(proposal);
  const navigate = useNavigate();

  const initSmoothScroll = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleNavigation = () => {
    startTransition(() => {
      navigate(`/${paths.TIMELINE}/${project?._id}`);
    });
  };

  useEffect(() => initSmoothScroll(), []);

  if (!project) {
    return null;
  }

  const isBitcredit = project.type === 'bitcredit';

  return (
    <div className="max-w-[700rem] w-full mx-auto animate-bottom-top">
      <div className="flex items-center justify-between">
        <Text
          message={proposalId ? 'Edit proposal' : 'Create proposal'}
          size="s22"
          font="titillium"
        />
        <div className="flex items-center cursor-pointer" onClick={handleNavigation}>
          <Avatar uniqueString={project._id} size={24} src={project?.avatar} />
          {Boolean(project?.name) && (
            <Text message={project.name} className="ml-8 hover:underline" size="m14" />
          )}
        </div>
      </div>
      {step === 1 && (
        <Step1
          register={register}
          onClickBack={goBack}
          errors={errors}
          clearErrors={clearErrors}
          onClickNext={async () => {
            if (isBitcredit) {
              handlePublish();
            } else {
              const isValid = await trigger();

              if (isValid) {
                setStep(2);
              }

              initSmoothScroll();
            }
          }}
          titleValue={titleValue}
          textValue={textAreaValue}
          deliverableValue={deliverableValue}
          roadmapValue={roadmapValue}
          trigger={trigger}
          isBitcredit={isBitcredit}
          control={control}
          proposalTypeValue={proposalTypeValue}
        />
      )}
      {step === 2 && (
        <Step2
          control={control}
          onClickBack={() => {
            setStep(1);

            initSmoothScroll();
          }}
          votingType={votingType}
          onClickNext={handlePublish}
          startDate={startDate}
          endDate={endDate}
          errors={errors}
          clearErrors={clearErrors}
          isPublishing={isPublishing}
          isBitcredit={isBitcredit}
        />
      )}
    </div>
  );
});
