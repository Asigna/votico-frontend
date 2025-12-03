import { useCallback, useMemo } from 'react';
import { changeMemberRole, deleteMember } from '@api/admin';

const useMemberItem = (
  handleChangeUser: (payload: { action: 'edit' | 'delete'; userId: string; type?: string }) => void
) => {
  const onChangeRole = useCallback(async (projectId: string, userId: string, role: string) => {
    if (userId) {
      const response = await changeMemberRole(projectId, userId, role);

      try {
        handleChangeUser({
          action: 'edit',
          userId: response.data.data.userId,
          type: response.data.data.type,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const onDeleteMember = useCallback(async (projectId: string, userId: string) => {
    const isDelete = confirm('Are you sure you want to delete this member?');

    if (isDelete) {
      try {
        await deleteMember(projectId, userId);

        handleChangeUser({
          action: 'delete',
          userId,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return useMemo(() => ({ onChangeRole, onDeleteMember }), [onChangeRole, onDeleteMember]);
};

export default useMemberItem;
