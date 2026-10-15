import React, { useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useAddress } from '@store';
import { joinToProject, leaveFromTheProject } from '@api/project.ts';
import { formatNumberToShortString } from '@utils';
import { Project } from '@pages/utils/types';

const useProjectItem = (
  props: Project & { onClickButton: (id: string, status: boolean) => void }
) => {
  const { _id, isMember, membersCount, onClickButton } = props;
  const { onLogin } = useOutletContext<{ onLogin: () => void }>();
  const { address } = useAddress();

  const handleClickButton = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      if (!address) {
        onLogin();
        return;
      }

      const result: { data: { success: boolean } } | undefined = isMember
        ? await leaveFromTheProject(_id)
        : await joinToProject(_id);

      // No response means the session is gone; reconnect instead of failing silently.
      if (!result) {
        onLogin();
        return;
      }

      if (result.data.success) {
        onClickButton(_id, !isMember);
      }
    },
    [_id, address, isMember, onClickButton, onLogin]
  );

  const shortCount = formatNumberToShortString(membersCount);

  return useMemo(
    () => ({
      handleClickButton,
      shortCount,
    }),
    [handleClickButton, shortCount]
  );
};

export default useProjectItem;
