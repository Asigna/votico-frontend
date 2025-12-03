import React from 'react';
import cx from 'classnames';

import { Button, Text, Image } from '@kit';
import { Strategy } from '@/pages/utils/types';
import { messages } from '@utils';

import useAddStrategyModal from './utils/useAddStrategyModal';
import images from './utils/images';
import { StepTicket } from './components/StepTicket';
import { StepWhitelist } from './components/StepWhitelist';
import { StepWeight } from './components/StepWeight';

import s from './index.module.scss';

type AddStrategyModalProps = {
  strategy: Strategy | null;
};

export const AddStrategyModal: React.FC<AddStrategyModalProps> = React.memo((props) => {
  const { strategy } = props;
  const {
    strategyList,
    standardTokens,
    selectedStrategy,
    errors,
    handleAddStrategy,
    register,
    control,
    setValue,
  } = useAddStrategyModal(strategy);

  return (
    <div
      className={cx(
        'rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] sm:min-w-[456rem] flex flex-col gap-24 border-[.5px] border-white-10 overflow-y-auto mx-16 sm:mx-0',
        s.wrap
      )}
    >
      <Text message="Add strategy" size="s22" />
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-24">
              <div className="flex gap-12 justify-between w-full">
                {strategyList.map((tab) => (
                  <div
                    onClick={() => {
                      setValue('strategy', tab);
                    }}
                    className={cx(
                      'flex flex-col flex-1 items-center py-[14rem] rounded-[8rem] border-[.5px]  gap-4 cursor-pointer min-h-[80rem]',
                      tab === selectedStrategy
                        ? 'opacity-100 border-primary bg-primary-5'
                        : 'opacity-70 border-white-10 bg-white-3'
                    )}
                    key={`tab-${tab}`}
                  >
                    {tab === 'WEIGHTED' && <Image src={images.weightIcon} size={20} />}
                    {tab === 'WHITELIST' && <Image src={images.whitelistIcon} size={20} />}
                    {tab === 'TICKET' && <Image src={images.ticketIcon} size={20} />}
                    <Text message={messages.strategies[tab]} size="m14" className="text-center" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {selectedStrategy === 'WEIGHTED' && (
            <StepWeight
              register={register}
              control={control}
              errors={errors}
              standardTokens={standardTokens}
            />
          )}
          {selectedStrategy === 'WHITELIST' && (
            <StepWhitelist register={register} control={control} errors={errors} />
          )}
          {selectedStrategy === 'TICKET' && <StepTicket register={register} errors={errors} />}
        </div>
        <Button
          message={strategy ? 'Edit' : 'Add'}
          size="md"
          className="mx-auto w-full"
          colorIcon="white"
          onClick={handleAddStrategy}
        />
      </div>
    </div>
  );
});
