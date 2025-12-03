import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input, Text } from '@kit';
import { Strategy } from '@/pages/utils/types';

type StepTicketProps = {
  register: UseFormRegister<Strategy & { network: string }>;
  errors: FieldErrors<Strategy & { network: string }>;
};

export const StepTicket: React.FC<StepTicketProps> = React.memo((props) => {
  const { register } = props;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <Text message="Ticket Stradegy" size="m14" />
        <Text message="Any wallet is eligible to vote" size="r14" color="regular" />
      </div>
      <Input placeholder="0" label="Voting Power" className="w-full" {...register('weight')} />
    </div>
  );
});
