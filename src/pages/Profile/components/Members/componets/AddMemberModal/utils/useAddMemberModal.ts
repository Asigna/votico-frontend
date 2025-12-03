import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

import { IMember } from '@types';
import { newMember } from '@api/admin';
import { User } from '@pages/utils/types';
import { validateBtcAddress } from '@utils';

export const roles: string[] = ['Admin', 'Author'];

const useAddMemberModal = (props: {
  handleNewMember: (address: string, role: IMember) => void;
}) => {
  const { handleNewMember } = props;
  const { projectId } = useParams();
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string[]>([roles[0]]);

  const addMember = useCallback(
    async (member: User) => {
      if (projectId) {
        try {
          const response = await newMember(projectId, member);
          if (response?.data?.success) {
            handleNewMember(member.address, response?.data?.data);
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            setAddressError(error.response?.data.message);
          }
        }
      }
    },
    [handleNewMember, projectId]
  );

  const handleOnChangeAddress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value);
      if (validateBtcAddress(event.target.value, 'mainnet') || event.target.value.length === 0) {
        setAddressError('');
      } else {
        setAddressError('Invalid address');
      }
    },
    [setAddress, setAddressError]
  );

  const handleAddMember = useCallback(() => {
    addMember({
      name: '',
      image: '',
      address,
      type: selectedRole[0],
    });
  }, [addMember, address, selectedRole]);

  return useMemo(
    () => ({
      roles,
      address,
      setAddress,
      addressError,
      setAddressError,
      selectedRole,
      setSelectedRole,
      addMember,
      handleAddMember,
      handleOnChangeAddress,
    }),
    [
      address,
      setAddress,
      addressError,
      setAddressError,
      selectedRole,
      setSelectedRole,
      addMember,
      handleAddMember,
      handleOnChangeAddress,
    ]
  );
};

export default useAddMemberModal;
