import React from 'react';

import { Text, Image } from '@kit';
import { getShortAddress } from '@utils';
import external from '@images/external.svg';

type AddressesModalProps = {
  addresses: string[];
};

export const AddressesModal: React.FC<AddressesModalProps> = React.memo((props) => {
  const { addresses } = props;
  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Addresses" size="s22" />
      <div className="flex flex-col mt-16 max-h-[350rem] overflow-y-auto">
        {addresses.map((address, index) => (
          <div
            key={address}
            className="flex w-full justify-between items-center gap-8 py-16 border-b-[.5px] border-white-10"
          >
            <Text message={`${index + 1}.`} size="r14" className="text-center" />
            <Text message={getShortAddress(address)} size="r14" className="text-center" />
            <a href="#" target="_blank" className="flex ml-auto">
              <Image src={external} size={20} color="white" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
});
