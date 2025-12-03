import { atom, useAtom } from 'jotai';

import { IUser } from '@types';
import { useEffect } from 'react';
import { getUserEmail } from '@api/email';

interface ISparrowConnect {
  isConnectOpened?: boolean;
  isSignPsbtOpened?: boolean;
  psbtToSign?: string;
  safeId?: string;
  onSignSuccess?: (signedTx: string) => void;
  onSignFailed?: () => void;
  signParams?: {
    users: IUser[];
  };
}

export const sparrowDialogAtom = atom<ISparrowConnect | null>(null);

export const userEmailAtom = atom<string>('');

const handleGetEmail = async () => {
  const response = await getUserEmail();
  return response?.data?.email.email || '';
};

const useHeader = () => {
  const [, setUserEmail] = useAtom(userEmailAtom);

  useEffect(() => {
    const fetch = async () => {
      const email = await handleGetEmail();
      setUserEmail(email);
    };

    fetch();
  }, [setUserEmail]);
};

export default useHeader;
