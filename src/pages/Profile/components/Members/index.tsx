import React, { useCallback, useState } from 'react';

import { Button, Modal, Text } from '@kit';
import { Project, User } from '@pages/utils/types';
import { IMember } from '@types';

import { SkeletonMember } from './componets/SkeletonMember';
import { AddMemberModal } from './componets/AddMemberModal';
import { MemberItem } from './componets/MemberItem';

type MembersProps = {
  project: Project;
};
export const Members: React.FC<MembersProps> = React.memo((props) => {
  const { project } = props;

  const [isLoading] = useState(false);
  const [isShowAddMember, setIsShowAddMember] = useState(false);

  const [members, setMembers] = useState<User[]>(project.team || []);

  const onAddMember = (address: string, data: IMember) => {
    setMembers((prevState) => [
      ...(prevState || []),
      { _id: data.userId, name: '', address, image: '', type: data.type },
    ]);
    setIsShowAddMember(false);
  };

  const handleChangeUser = useCallback(
    ({ action, userId, type }: { action: 'edit' | 'delete'; userId: string; type?: string }) => {
      if (action === 'edit') {
        setMembers((prevState) =>
          prevState.map((member) => {
            if (type && member._id === userId) {
              member.type = type;
            }

            return member;
          })
        );
      } else if (action === 'delete') {
        setMembers((prevState) =>
          prevState.filter((member) => {
            return member._id !== userId;
          })
        );
      }
    },
    [setMembers, members]
  );

  const countAdmins = members.filter((member) => member.type === 'admin').length;

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <Text message="Core members" font="titillium" size="s22" />
        <Button
          message="+ Add member"
          size="sm"
          className="min-w-[132rem] sm:min-w-[168rem]"
          onClick={() => setIsShowAddMember(true)}
        />
      </div>
      <div className="mt-24 gap-24 flex flex-col">
        {isLoading
          ? [0, 1, 2, 3].map((item) => <SkeletonMember key={`skeletonMember-${item}`} />)
          : members?.map((member) => (
              <MemberItem
                projectId={project._id}
                member={member}
                key={member._id}
                handleChangeUser={handleChangeUser}
                isCanDeleteAdmin={countAdmins > 1}
              />
            ))}
      </div>
      <Modal onClose={() => setIsShowAddMember(false)} isShow={isShowAddMember}>
        <AddMemberModal handleNewMember={onAddMember} />
      </Modal>
    </div>
  );
});
