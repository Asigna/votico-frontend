import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form';

import { Button, ComboBox, DatePicker, Image, Input, Text, TextArea } from '@kit';
import warningIcon from '@images/warning.svg';
import { NewProposal, ProposalType } from '@api/admin';

type Step1Props = {
  onClickBack: () => void;
  onClickNext: () => void;
  trigger: UseFormTrigger<NewProposal>;
  clearErrors: UseFormClearErrors<NewProposal>;
  register: UseFormRegister<NewProposal>;
  errors: FieldErrors<NewProposal>;
  titleValue: string;
  textValue: string;
  isBitcredit?: boolean;
  control?: Control<NewProposal, unknown>;
  deliverableValue?: string;
  roadmapValue?: string;
  proposalTypeValue?: ProposalType;
};

const LIMIT_TEXT = 10000;

const ProposalTypeLabels = {
  // common: 'None',
  contribution_proposal: 'Contribution proposal',
  delivery_acceptance: 'Delivery acceptance',
  strategic_decision: 'Strategic decision',
} as const;

export const Step1: React.FC<Step1Props> = React.memo((props) => {
  const {
    onClickBack,
    onClickNext,
    register,
    errors,
    clearErrors,
    titleValue,
    textValue,
    trigger,
    isBitcredit = false,
    control,
    deliverableValue,
    roadmapValue,
    proposalTypeValue,
  } = props;

  const proposalKeys = Object.keys(ProposalTypeLabels);

  return (
    <>
      {Boolean(errors?.root) && (
        <div className="py-12 px-16 mt-24 flex bg-primary-10 border-[.5px] border-primary-30 rounded-[8rem]">
          <Image src={warningIcon} size={24} />
          {errors?.root?.message === '5 Proposals already created' ? (
            <div className="ml-8">
              <Text
                className="inline"
                message="You have reached your limit on the number of proposals creation."
                size="m16"
              />
              <a
                href="https://votico.gitbook.io/votico/user-guides/proposal#who-can-create-a-proposal"
                className="ml-8"
                target="_blank"
                rel="nofollow"
              >
                <Text className="inline" message="Learn more" size="m16" color="primary" />
              </a>
            </div>
          ) : (
            <div className="ml-8">
              <Text className="inline" message={errors?.root?.message || ''} size="m16" />
            </div>
          )}
        </div>
      )}
      {isBitcredit && (
        <div className="flex mt-20 items-start justify-between gap-20">
          <Controller
            control={control}
            name="proposalType"
            render={({ field }) => (
              <ComboBox
                items={proposalKeys}
                selected={field.value as unknown as string}
                onChange={(val) => field.onChange(val)}
                itemMap={(val) => ProposalTypeLabels[val as keyof typeof ProposalTypeLabels]}
                fullWidth
                label="Proposal type"
              />
            )}
          />
        </div>
      )}
      <Input
        {...register('title', {
          required: 'Title is required',
          validate: (value) => {
            const trimmed = value.trim();

            if (!trimmed) {
              return 'Title is required';
            }

            if (value.length > LIMIT_TEXT) {
              return `Max length > ${LIMIT_TEXT} characters`;
            }
            return true;
          },
        })}
        className="mt-24"
        label="Title"
        placeholder=""
        error={errors.title?.message}
        onKeyUp={() => titleValue.length > 0 && trigger('title')}
      />
      <TextArea
        {...register('text', {
          required: 'Description is required',
          validate: (value) => {
            const trimmed = value.trim();

            if (!trimmed) {
              return 'Description is required';
            }

            if (value.length > LIMIT_TEXT) {
              return `Max length > ${LIMIT_TEXT} characters`;
            }
            return true;
          },
        })}
        label="Description"
        placeholder="What is your proposal about?"
        className="w-full mt-24"
        limit={LIMIT_TEXT}
        error={errors.text?.message}
        value={textValue}
        onKeyUp={() => textValue.length > 0 && trigger('text')}
      />
      {isBitcredit && (
        <div className="mt-24">
          <Input
            {...register('links.0.link', {
              required: 'Link is required',
              validate: (value: string) => {
                const trimmed = value.trim();

                if (!trimmed) {
                  return 'Link to GitHub is required';
                }

                if (!/^https:\/\/(www\.)?github\.com\/.+/.test(trimmed)) {
                  return 'Must be a valid GitHub URL';
                }

                return true;
              },
            })}
            label="Link to the associated GitHub discussion"
            placeholder=""
            onKeyUp={() => {
              trigger('links.0.link');
            }}
            error={
              errors.links?.message?.startsWith('0')
                ? errors.links?.message.slice(1)
                : errors.links?.message?.startsWith('2')
                  ? ' '
                  : Array.isArray(errors.links) && errors.links?.[0]?.link?.message
                    ? errors.links?.[0]?.link?.message
                    : undefined
            }
          />
          <Input
            {...register('links.1.link', {
              required:
                proposalTypeValue === 'delivery_acceptance' ? 'Link is required' : undefined,
              validate: (value: string) => {
                if (proposalTypeValue !== 'delivery_acceptance') return true;

                const trimmed = value.trim();

                if (!trimmed) {
                  return 'Link is required';
                }

                if (!/^https:\/\/([a-zA-Z0-9-]+\.)*voti\.co\/.+/.test(trimmed)) {
                  return 'Must be a valid voti.co URL';
                }

                return true;
              },
            })}
            label={
              proposalTypeValue === 'delivery_acceptance'
                ? 'Link to the related previous proposal'
                : 'Link to the related previous proposal (optional)'
            }
            placeholder=""
            onKeyUp={() => {
              trigger('links.1.link');
            }}
            error={
              errors.links?.message?.startsWith('1') || errors.links?.message?.startsWith('2')
                ? errors.links?.message.slice(1)
                : Array.isArray(errors.links) && errors.links?.[1]?.link?.message
                  ? errors.links?.[1]?.link?.message
                  : undefined
            }
          />
        </div>
      )}
      {!isBitcredit && (
        <Input
          {...register('discussion')}
          className="mt-24"
          label="Discussion (optional)"
          placeholder="Paste link here"
          error={errors.discussion?.message}
          onChange={() => clearErrors('discussion')}
        />
      )}
      {isBitcredit && (
        <>
          <div>
            {proposalTypeValue !== 'strategic_decision' && (
              <div>
                <Text
                  message={
                    proposalTypeValue === 'delivery_acceptance' ? 'Deliverable' : 'Next Deliverable'
                  }
                  size="m16"
                  color="white"
                  className="mt-24"
                />
                <TextArea
                  {...register('nextMilestone.deliverable', {
                    required: 'Deliverable is required',
                    validate: (value) => {
                      const trimmed = value.trim();

                      if (!trimmed) {
                        return 'Deliverable is required';
                      }

                      if (value.length > LIMIT_TEXT) {
                        return `Max length > ${LIMIT_TEXT} characters`;
                      }
                      return true;
                    },
                  })}
                  label="Deliverable description"
                  placeholder="Enter details here"
                  className="w-full mt-24"
                  limit={LIMIT_TEXT}
                  error={errors.nextMilestone?.deliverable?.message}
                  value={deliverableValue}
                  onKeyUp={() =>
                    deliverableValue &&
                    deliverableValue.length > 0 &&
                    trigger('nextMilestone.deliverable')
                  }
                />

                <div className="flex mt-20 items-start justify-between gap-20">
                  <Controller
                    control={control}
                    name="nextMilestone.deadline"
                    render={({ field }) => (
                      <DatePicker
                        value={Number(field.value)}
                        className="w-full"
                        label={
                          proposalTypeValue === 'delivery_acceptance'
                            ? 'Actual delivery date'
                            : 'Deadline'
                        }
                        onChange={(newSelected) => {
                          clearErrors('endDate');
                          field.onChange(+new Date(newSelected[0]));
                        }}
                        error={errors.nextMilestone?.deadline?.message}
                        addHour={3}
                      />
                    )}
                  />

                  <Input
                    {...register('nextMilestone.rewardAmount', {
                      required: 'Reward amount is required',
                      validate: (value) => {
                        if (Number(value) < 1) {
                          return 'Mininal amount 1 e-IOU';
                        }
                        if (Number(value) > 1000000000) {
                          return 'Maximum amount 1000000000 e-IOU';
                        }
                        return true;
                      },
                    })}
                    label={
                      proposalTypeValue === 'delivery_acceptance'
                        ? 'Final reward amount'
                        : 'Reward amount'
                    }
                    placeholder="e-IOU"
                    error={errors.nextMilestone?.rewardAmount?.message}
                    onKeyUp={(e) => {
                      const target = e.target as HTMLInputElement;
                      const onlyDigits = target.value.replace(/\D+/g, '');
                      target.value = onlyDigits;
                      trigger('nextMilestone.rewardAmount');
                    }}
                    type="text"
                  />
                </div>
                {proposalTypeValue !== 'contribution_proposal' && (
                  <Input
                    {...register('rewardRecipient', {
                      required: 'Reward recipient is required',
                      validate: (value) => {
                        const trimmed = value?.trim();

                        if (!trimmed) {
                          return 'Reward recipient is required';
                        }

                        return true;
                      },
                    })}
                    label="Reward recipient"
                    placeholder=""
                    error={errors.rewardRecipient?.message}
                    className="mt-24"
                    // onChange={() => clearErrors('rewardRecipient')}
                    onKeyUp={() => trigger('rewardRecipient')}
                  />
                )}

                <TextArea
                  {...register('roadmap', {
                    validate: (value) => {
                      if (value && value.length > LIMIT_TEXT) {
                        return `Max length > ${LIMIT_TEXT} characters`;
                      }
                      return true;
                    },
                  })}
                  label="Roadmap (Optional)"
                  placeholder=""
                  className="w-full mt-24"
                  limit={LIMIT_TEXT}
                  error={errors.roadmap?.message}
                  value={roadmapValue}
                  onKeyUp={() => roadmapValue && roadmapValue.length > 0 && trigger('text')}
                />
              </div>
            )}
          </div>

          {Boolean(errors?.root) && (
            <div className="py-12 px-16 mt-24 flex bg-primary-10 border-[.5px] border-primary-30 rounded-[8rem]">
              <Image src={warningIcon} size={24} />
              {errors?.root?.message === '5 Proposals already created' ? (
                <div className="ml-8">
                  <Text
                    className="inline"
                    message="You have reached your limit on the number of proposals creation."
                    size="m16"
                  />
                  <a
                    href="https://votico.gitbook.io/votico/user-guides/proposal#who-can-create-a-proposal"
                    className="ml-8"
                    target="_blank"
                    rel="nofollow"
                  >
                    <Text className="inline" message="Learn more" size="m16" color="primary" />
                  </a>
                </div>
              ) : (
                <div className="ml-8">
                  <Text className="inline" message={errors?.root?.message || ''} size="m16" />
                </div>
              )}
            </div>
          )}
        </>
      )}
      <div className="flex mt-24 gap-16 justify-end">
        <Button
          className="min-w-[112rem] sm:min-w-[148rem]"
          message="Back"
          size="sm"
          colorType="secondary"
          onClick={onClickBack}
        />
        <Button
          className="min-w-[112rem] sm:min-w-[148rem]"
          message={isBitcredit ? 'Publish' : 'Next'}
          size="sm"
          onClick={onClickNext}
          disabled={
            Boolean(errors.text?.message) ||
            Boolean(errors.title?.message) ||
            // Boolean(errors?.root) ||
            Boolean(errors.roadmap?.message) ||
            Boolean(errors.rewardRecipient?.message) ||
            Boolean(errors.nextMilestone?.deliverable?.message) ||
            Boolean(errors.nextMilestone?.rewardAmount?.message) ||
            Boolean(errors.links?.message)
          }
        />
      </div>
    </>
  );
});
