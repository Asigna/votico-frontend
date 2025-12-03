import React from 'react';
import { Controller } from 'react-hook-form';

import { Text, Button, Input, Toggle, Image } from '@kit';
import alert from '@images/alert.svg';
import external from '@images/external.svg';
import urls from '@constants/urls';

import useProposalSettings from './utils/useProposalSettings';

export const ProposalSettings: React.FC = React.memo(() => {
  const { control, errors, register, reset, handleSubmit, onSubmit, isEnableGuest } =
    useProposalSettings();

  const handleResetForm = () => {
    reset();
  };

  return (
    <div className="flex flex-col gap-24 animate-bottom-top">
      <div className="container flex flex-col gap-24">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text size="s22" font="titillium" message="Proposal" />
          <Input
            placeholder=""
            label="Set minimum voting power requirement"
            className="w-full"
            error={errors.minPower?.message}
            disabled={isEnableGuest}
            {...(register('minPower'), { required: 'Field name is required' })}
          />

          <div className="mt-16 flex items-center">
            <Controller
              control={control}
              name="isEnableGuest"
              render={({ field }) => (
                <Toggle
                  isActive={field.value}
                  onClick={() => {
                    // field.onChange(!field.value);// TODO: temporarily remove
                  }}
                  className="opacity-50"
                />
              )}
            />
            <Text size="m14" message="Allow only authors to submit a proposal" className="ml-16" />
          </div>
        </form>
      </div>
      <div className="flex gap-8 px-16 py-12 rounded-[12rem] bg-primary-10 border-[.5px] border-primary-30">
        <Image src={alert} size={24} color="white" />
        <Text size="m16" message="To manage the strategies contact support via " />
        <a href={urls.DISCORD} target="_blank" className="flex aling-center gap-4">
          <Text className="inline" message="Discord" size="m16" color="primary" />
          <Image src={external} size={24} color="primary" />
        </a>
      </div>
      <div className="flex mt-24 gap-16 justify-end">
        <Button
          className="min-w-[112rem] sm:min-w-[148rem]"
          message="Cancel edits"
          size="sm"
          colorType="secondary"
          onClick={handleResetForm}
          disabled // TODO: temporarily disabled
        />
        <Button
          className="min-w-[112rem] sm:min-w-[148rem]"
          message="Save"
          size="sm"
          onClick={onSubmit}
          disabled // TODO: temporarily disabled
        />
      </div>
    </div>
  );
});
