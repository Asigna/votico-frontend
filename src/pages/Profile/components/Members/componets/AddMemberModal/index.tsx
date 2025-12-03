import React from 'react';

import { Button, Text, Input, Dropdown } from '@kit';
import { IMember } from '@types';

import useAddMemberModal from './utils/useAddMemberModal';

type AddMemberModalProps = {
  handleNewMember: (address: string, role: IMember) => void;
};

export const AddMemberModal: React.FC<AddMemberModalProps> = React.memo((props) => {
  const {
    roles,
    address,
    addressError,
    selectedRole,
    setSelectedRole,
    handleOnChangeAddress,
    handleAddMember,
  } = useAddMemberModal(props);

  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] sm:min-w-[456rem] flex flex-col gap-32 border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Add member" size="s22" />
      <div className="flex flex-col gap-24">
        <Input
          placeholder="Address"
          label="Address"
          className="w-full"
          onChange={handleOnChangeAddress}
          value={address}
          error={addressError}
        />
        <Dropdown
          label="Role"
          selected={selectedRole}
          items={roles}
          onChange={(val) => setSelectedRole(val)}
          className="w-full"
        />
      </div>
      <Button
        message="Save"
        size="md"
        className="mx-auto w-full"
        colorIcon="white"
        onClick={handleAddMember}
        disabled={addressError.length > 0 || address.length === 0}
      />
    </div>
  );
});
