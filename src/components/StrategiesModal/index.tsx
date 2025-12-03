import React, { useState } from 'react';

import { Modal, Text } from '@kit';
import { Strategy } from '@pages/utils/types';

import { StrategyItem } from '../StrategyItem';
import { AddressesModal } from '../AddressesModal';

type StrategiesModalProps = {
  strategies: Strategy[];
};

export const StrategiesModal: React.FC<StrategiesModalProps> = React.memo((props) => {
  const { strategies } = props;
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);

  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Strategie(s)" size="s22" />
      <div className="flex flex-col max-h-[94vw] overflow-y-auto">
        {Array.isArray(strategies) && strategies.length > 0 && (
          <div className="mt-32 container">
            <div className="flex flex-col gap-24">
              {strategies.map((strategy, index) => (
                <div className="flex flex-col gap-24" key={index}>
                  <StrategyItem
                    strategy={strategy}
                    handleClick={() => setSelectedAddresses(strategy.whitelist || [])}
                  />
                  {index !== strategies.length - 1 && (
                    <div className="h-[1rem] w-full bg-white-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
