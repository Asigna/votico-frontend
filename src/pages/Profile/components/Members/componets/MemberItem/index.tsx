import React from 'react';

import { Avatar } from '@components';
import { getShortAddress } from '@utils';
import { Dropdown, Image, Text } from '@kit';
import trashIcon from '@images/trash.svg';
import { User } from '@pages/utils/types';

import useMemberItem from './utils/useMemberItem';

const roles: string[] = ['Admin', 'Author'];

type MemberItemProps = {
  projectId: string;
  member: User;
  isCanDeleteAdmin: boolean;
  handleChangeUser: (payload: { action: 'edit' | 'delete'; userId: string; type?: string }) => void;
};

export const MemberItem: React.FC<MemberItemProps> = React.memo((props) => {
  const { member, projectId, isCanDeleteAdmin, handleChangeUser } = props;
  const { onDeleteMember, onChangeRole } = useMemberItem(handleChangeUser);

  const role = member.type.charAt(0).toUpperCase() + member.type.slice(1);

  return (
    <div className="flex items-center min-h-[48rem]">
      <Avatar uniqueString={member.address} size={40} />
      <Text size="m14" className="ml-8 sm:ml-12" message={getShortAddress(member.address)} />
      {(member.type === 'admin' && isCanDeleteAdmin) || member.type !== 'admin' ? (
        <>
          <Dropdown
            className="sm:min-w-[140rem] ml-auto"
            selected={[role]}
            items={roles}
            onChange={(values) => {
              if (member._id) {
                onChangeRole(projectId, member._id, values[0].toLowerCase());
              }
            }}
          />
          <button
            type="button"
            className="pl-16"
            onClick={() => {
              if (member._id) {
                onDeleteMember(projectId, member._id);
              }
            }}
          >
            <Image src={trashIcon} size={12} className="hover:opacity-80" />
          </button>
        </>
      ) : (
        <Text size="m14" className="ml-auto" message={role} />
      )}
    </div>
  );
});
