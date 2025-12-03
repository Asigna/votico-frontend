import React from 'react';
import { FieldErrors, UseFormClearErrors, Control, Controller } from 'react-hook-form';

import { Button, DatePicker, Dropdown, Text, Image } from '@kit';
import { Choices } from '@components';
import { NewProposal } from '@api/admin';
import { messages } from '@utils';
import warningIcon from '@images/warning.svg';

const initialChoices = [
  { id: 0, name: 'For' },
  { id: 1, name: 'Against' },
  { id: 2, name: 'Abstain' },
];

const initialBitcreditChoices = [
  { id: 0, name: 'For' },
  { id: 1, name: 'Against' },
  { id: 2, name: 'Neutral' },
];

type Step2Props = {
  onClickBack: () => void;
  onClickNext: () => void;
  control: Control<NewProposal, unknown>;
  votingType: 'single' | 'weighted' | 'approval' | 'basic'; // | 'ranked'
  startDate: number;
  endDate: number;
  errors: FieldErrors<NewProposal>;
  clearErrors: UseFormClearErrors<NewProposal>;
  isPublishing: boolean;
  isBitcredit?: boolean;
};

export const Step2: React.FC<Step2Props> = React.memo((props) => {
  const {
    onClickBack,
    onClickNext,
    control,
    votingType,
    startDate,
    errors,
    clearErrors,
    isPublishing,
    isBitcredit = false,
  } = props;

  return (
    <div className="animate-top-bottom">
      <Controller
        control={control}
        name="votingType"
        render={({ field }) => (
          <Dropdown
            className="mt-24"
            selected={[field.value]}
            label="Voting type"
            items={Object.keys(messages.votingType)}
            onChange={(newSelected) => {
              field.onChange(newSelected[0]);
            }}
            messageByItemList={messages.votingType}
          />
        )}
      />
      <div className="container mt-8">
        <Text
          message={messages.votingType[votingType as keyof typeof messages.votingType]}
          size="s16"
        />
        <Text
          message={messages.votingTypeDescription[votingType as keyof typeof messages.votingType]}
          size="r14"
          color="regular"
        />
      </div>
      <Controller
        control={control}
        name="options"
        render={({ field }) => (
          <Choices
            className="mt-24"
            choices={isBitcredit ? initialBitcreditChoices : initialChoices}
            disabled={votingType === 'basic'}
            onChange={(newSelected) => {
              const updatedOptions = newSelected.map((item) => item.name);
              field.onChange(updatedOptions);
            }}
          />
        )}
      />
      <div className="container mt-24">
        <Text size="s22" font="titillium" message="Voting period" />
        <div className="flex mt-20 items-start justify-between gap-20">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                value={Number(field.value)}
                className="w-full"
                label="Start"
                onChange={(newSelected) => {
                  clearErrors('endDate');
                  field.onChange(+new Date(newSelected[0]));
                  //TODO: check endDate: startDate + 24h
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                className="w-full"
                label="End"
                onChange={(newSelected) => {
                  clearErrors('endDate');
                  field.onChange(+new Date(newSelected[0]));
                }}
              />
            )}
            rules={{
              validate: (value) => {
                clearErrors('endDate');
                if (value && startDate && value < startDate) {
                  return 'End time must be later than Start time';
                }
                const currentTime = Date.now();
                if (value && value <= currentTime) {
                  return 'End time must be greater than today';
                }
                return true;
              },
            }}
          />
        </div>
        {Boolean(errors.endDate?.message) && (
          <div className="flex mt-12 items-center justify-center">
            <Text size="r14" font="titillium" message={errors.endDate?.message || ''} color="red" />
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
          message="Publish"
          size="sm"
          onClick={onClickNext}
          disabled={Boolean(errors.endDate?.message) || Boolean(errors?.root) || isPublishing}
        />
      </div>
    </div>
  );
});
