import React from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { Dropdown, Input, Text, TextArea } from '@kit';
import btcIcon from '@images/btc-icon.png';
import { Strategy } from '@/pages/utils/types';

type StepWhitelistProps = {
  register: UseFormRegister<Strategy & { network: string }>;
  control: Control<Strategy & { network: string }, unknown>;
  errors: FieldErrors<Strategy & { network: string }>;
};

export const StepWhitelist: React.FC<StepWhitelistProps> = React.memo((props) => {
  const { register, control } = props;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <Text message="Whitelist Stradegy" size="m14" />
        <Text message="Specified addresses are eligible to vote" size="r14" color="regular" />
      </div>

      <Controller
        control={control}
        name="network"
        render={({ field }) => (
          <Dropdown
            label="Network"
            selected={[field.value]}
            items={[field.value]}
            className="w-full"
            leftIcon={btcIcon}
            disabled
            onChange={(newSelected) => {
              field.onChange(newSelected[0]);
            }}
          />
        )}
      />

      <Input placeholder="0" label="Voting Power" className="w-full" {...register('weight')} />
      <TextArea
        {...register('whitelist', {
          required: 'Description is required',
        })}
        label="Addresses"
        placeholder="Enter address(es) here. Each in the new line"
        className="w-full"
      />
    </div>
  );
});
