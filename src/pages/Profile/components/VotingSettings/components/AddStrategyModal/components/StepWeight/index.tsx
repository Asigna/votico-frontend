import React from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { Dropdown, Input, Text } from '@kit';
import btcIcon from '@images/btc-icon.png';
import { Strategy } from '@/pages/utils/types';

type StepWeightProps = {
  register: UseFormRegister<Strategy & { network: string }>;
  control: Control<Strategy & { network: string }, unknown>;
  errors: FieldErrors<Strategy & { network: string }>;
  standardTokens: string[];
};

export const StepWeight: React.FC<StepWeightProps> = React.memo((props) => {
  const { register, control, standardTokens } = props;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <Text message="Token Weighted Stradegy" size="m14" />
        <Text
          message="Holders of specified assets are eligible to vote"
          size="r14"
          color="regular"
        />
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
      <Controller
        control={control}
        name="asset.type"
        render={({ field }) => (
          <Dropdown
            label="Token standard"
            selected={[field.value || '']}
            items={standardTokens}
            className="w-full"
            onChange={(newSelected) => {
              field.onChange(newSelected[0]);
            }}
          />
        )}
      />
      <Input
        placeholder=""
        label="Token ticker / Rune name / Ordinals collection"
        className="w-full"
        {...register('asset.assetId')}
      />
    </div>
  );
});
