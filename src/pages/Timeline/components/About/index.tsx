import React, { useState } from 'react';

import { Text, Image, Modal } from '@kit';
import { getShortAddress } from '@utils';
import { AddressLink, AddressesModal, Avatar, StrategyItem } from '@components';
import { Project } from '@pages/utils/types';
import external from '@images/external.svg';

type AboutProps = {
  project: Project;
};

export const About: React.FC<AboutProps> = React.memo((props) => {
  const { project } = props;
  const countStrategies =
    project.strategies?.filter((item) => item.strategy !== 'QUORUM').length || 0;
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Text message={project.name} size="s22" font="titillium" />
        {Boolean(project.termsLink) && (
          <a href={project.termsLink || ''} target="_blank" className="flex mt-8">
            <Text message="Terms" size="r14" />
            <Image src={external} size={20} color="white" className="ml-4" />
          </a>
        )}
      </div>
      {Boolean(project.about) && (
        <Text message={project.about as string} color="regular" size="r14" className="mt-8" />
      )}

      {Array.isArray(project.strategies) && countStrategies > 0 && (
        <div className="mt-32 container">
          <div className="flex gap-8 pb-24">
            <Text message="Strategies" font="titillium" size="s22" />
            <Text
              message={countStrategies}
              font="titillium"
              size="s18"
              className="flex items-center justify-center bg-white-10 rounded-[50%] w-[32rem] h-[32rem]"
            />
          </div>
          <div className="flex flex-col gap-24">
            {project.strategies
              .filter((strategy) => strategy.strategy !== 'QUORUM')
              .map((strategy, index) => (
                <div className="flex flex-col gap-24" key={index}>
                  <StrategyItem
                    strategy={strategy}
                    handleClick={() => setSelectedAddresses(strategy.whitelist || [])}
                  />
                  {index !== countStrategies - 1 && <div className="h-[1rem] w-full bg-white-10" />}
                </div>
              ))}
          </div>
        </div>
      )}
      {Array.isArray(project.team) && project.team.length > 0 && (
        <div className="pt-32">
          <div className="flex gap-8">
            <Text message="Core members" font="titillium" size="s22" />
            <Text
              message={project.team.length}
              font="titillium"
              size="s18"
              className="flex items-center justify-center bg-white-10 rounded-[50%] w-[32rem] h-[32rem]"
            />
          </div>
          {project.team.map((admin) => (
            <div className="flex items-center mt-16" key={admin.address}>
              <Avatar uniqueString={admin.address} size={40} />
              <Text message={getShortAddress(admin.address)} size="m14" className="ml-12" />
              <Text
                message={admin.type}
                size="r14"
                className="text-[13rem] capitalize px-8 py-2 bg-white-10 rounded-[32rem] ml-12"
              />
              <AddressLink address={admin.address} isAddress />
            </div>
          ))}
        </div>
      )}
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
