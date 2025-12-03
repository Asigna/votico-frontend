import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Text, Image, Button, Modal, Toggle, Input } from '@kit';
import { Project, Strategy } from '@pages/utils/types';
import { AddressesModal, StrategyItem, Tooltip } from '@components';
import alert from '@images/alert.svg';
import external from '@images/external.svg';
import question from '@images/question.svg';
import urls from '@constants/urls';

import { AddStrategyModal } from './components/AddStrategyModal';
import useVotingSettings from './utils/useVotingSettings';

type VotingSettingsProps = {
  project: Project;
  setProject: (project: Project) => void;
};

export const VotingSettings: React.FC<VotingSettingsProps> = React.memo((props) => {
  const { project, setProject } = props;
  const [isShowAddStrategy, setIsShowAddStrategy] = useState<boolean>(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);

  const {
    isQuorum,
    setQuorum,
    register,
    errors,
    reset,
    onSubmit,
    handleSubmit,
    weightQuorumValue,
    isDirty,
    control,
  } = useVotingSettings(project, setProject);

  const handleResetForm = () => reset();

  return (
    <div className="flex flex-col gap-24 animate-bottom-top">
      <div className="container flex flex-col gap-24">
        <Text size="s22" font="titillium" message="Voting" />
        <div className="flex flex-col gap-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Text size="m16" message="Quorum" />
              <Tooltip
                content="The minimum amount of voting power required for the proposal to pass"
                className="max-w-[300rem]"
              >
                <Image src={question} size={16} className="cursor-pointer" />
              </Tooltip>
            </div>

            <Controller
              control={control}
              name="toggle"
              render={({ field }) => (
                <Toggle
                  isActive={field.value}
                  onClick={() => {
                    setQuorum((prevState) => !prevState);
                    field.onChange(!field.value);
                  }}
                />
              )}
            />
          </div>
          {isQuorum && (
            <Input
              placeholder="e.g 1000"
              className="w-full"
              {...register('weightQuorum', { required: 'Value is required' })}
              error={errors.weightQuorum?.message}
            />
          )}
        </div>

        <div className="h-[1rem] w-full bg-white-10" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-8">
            <Text size="m16" message="Select up to 5 strategies" />
            <Text size="r14" message="Voting power is cumulative" color="regular" />
          </div>
          <Button
            className="min-w-[99rem]"
            message="+ Add"
            size="sm"
            colorType="secondary"
            onClick={() => setIsShowAddStrategy(true)}
            disabled={(project.strategies || []).length >= 8}
          />
        </div>
        <div className="flex flex-col gap-16">
          {(project.strategies || [])
            .filter((strategy) => strategy.strategy !== 'QUORUM')
            .map((strategy, index) => (
              <StrategyItem
                strategy={strategy}
                key={index}
                handleDelete={() => {}}
                handleEdit={() => {}}
                handleClick={() => setSelectedAddresses(strategy.whitelist || [])}
              />
            ))}
        </div>
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
        />
        <Button
          className="min-w-[112rem] sm:min-w-[148rem]"
          message="Save"
          size="sm"
          onClick={handleSubmit(onSubmit)}
          disabled={(isQuorum && Number(weightQuorumValue) === 0) || !isDirty}
        />
      </div>
      <Modal
        onClose={() => {
          setIsShowAddStrategy(false);
          setSelectedStrategy(null);
        }}
        isShow={Boolean(isShowAddStrategy || !!selectedStrategy)}
      >
        <AddStrategyModal strategy={selectedStrategy} />
      </Modal>
      <Modal
        onClose={() => {
          setSelectedAddresses([]);
        }}
        isShow={selectedAddresses.length > 0}
      >
        <AddressesModal addresses={selectedAddresses} />
      </Modal>
    </div>
  );
});
