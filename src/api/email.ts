import { voticoAxiosInstance } from '@api/instance.ts';

export type EmailActionType = 'set' | 'replace' | 'delete';

type EmailSettings = {
  email?: string;
  createMessageSignature?: boolean;
  createTransaction?: boolean;
  executeTransaction?: boolean;
  finalizeMessageSignature?: boolean;
  signMessageSignature?: boolean;
  signTransaction?: boolean;
};

export type EmailUserSettings = {
  address: string;
  publicKey: string;
  walletClass: string;
  walletType: string;
  email?: EmailSettings;
};

export interface EmailMultisigSettingsResponse {
  success: boolean;
  data?: {
    user?: EmailUserSettings;
  };
}

export interface EmailSettingsResponse {
  success: boolean;
  data?: {
    address: string;
    email: {
      email: string;
    };
  };
}

export const updateSafeEmail = async (email: string, actionType: EmailActionType) => {
  const params = new URLSearchParams({
    email: email,
    type: actionType,
  });

  const url = `email?${params.toString()}`;

  return voticoAxiosInstance.get(url).then((data) => data.data);
};

export const verifySafeEmail = async (
  email: string,
  code: string,
  actionType: EmailActionType
): Promise<EmailMultisigSettingsResponse> => {
  const params = new URLSearchParams({
    email: email,
    code: code,
    type: actionType,
  });

  const url = `email/verify?${params.toString()}`;

  return voticoAxiosInstance.get(url).then((data) => data.data);
};

export const unlinkSafeEmail = async (email: string) => {
  const params = new URLSearchParams({
    email: email,
  });

  return voticoAxiosInstance
    .delete<{ success: boolean }>(`email/unlink-email?${params.toString()}`)
    .then((response) => response.data);
};

export const getUserEmail = async (): Promise<EmailSettingsResponse> => {
  const url = 'email/user';

  return voticoAxiosInstance.get(url).then((data) => data.data);
};
