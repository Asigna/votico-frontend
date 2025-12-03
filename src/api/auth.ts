import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getStorageKeysForNetwork } from '@hooks';
import {
  ContactsResponse,
  GetMultisigUsersResponse,
  ICreateUserSignature,
  WalletType,
} from '@types';

import { apiUrl, refreshAxios, voticoAxiosInstance } from './instance.ts';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  isRetry?: boolean;
}

export const getApiBAseUrl = () => {
  return apiUrl;
};

export const bitcoinLogin = async ({
  signature,
  address,
  publicKey,
  network,
  walletType,
}: {
  signature: string;
  address: string;
  publicKey: string;
  network: string;
  walletType: WalletType;
}) => {
  try {
    const response = await voticoAxiosInstance.post('/auth', {
      signature,
      address,
      publicKey,
      walletType,
    });
    const token = response.data.data;
    const storageKeys = getStorageKeysForNetwork(network);
    localStorage.setItem(storageKeys.walletClass, token.walletClass);
    localStorage.setItem(storageKeys.voticoToken, token.jwtToken);
    localStorage.setItem(storageKeys.voticoRefresh, token.refreshToken.refreshToken);
    voticoAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.jwtToken}`;
  } catch (error) {
    console.error(error);
  }
};

voticoAxiosInstance.interceptors.request.use((config) => {
  const network = 'mainnet';
  const storageKeys = getStorageKeysForNetwork(network);
  const token = localStorage.getItem(storageKeys.voticoToken);
  config.baseURL = apiUrl;
  if (config.headers) {
    if (!config.headers['Authorization']) {
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

voticoAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig;
    const network = 'mainnet';
    if (error.response?.status === 401 && !originalConfig.isRetry) {
      originalConfig.isRetry = true;
      try {
        const storageKeys = getStorageKeysForNetwork(network);
        const refreshToken = localStorage.getItem(storageKeys.voticoRefresh);
        if (!refreshToken) return;
        const refreshResponse = await refreshAxios.post('auth/refresh', {
          refreshToken,
        });
        localStorage.setItem(storageKeys.voticoToken, refreshResponse.data.data.jwtToken);
        localStorage.setItem(
          storageKeys.voticoRefresh,
          refreshResponse.data.data.refreshToken.refreshToken
        );
        voticoAxiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${refreshResponse.data.data.jwtToken}`;

        return voticoAxiosInstance(originalConfig);
      } catch (refreshError) {
        console.error('Error: Refresh token expired or invalid.');
        localStorage.clear();
        window.location.reload();

        //window.location.replace('/?error=unknown'); // show authorization error modal
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const getAllMyContacts = async () =>
  voticoAxiosInstance.get<ContactsResponse>(`/contacts/`, {}).then((data) => data.data);

export const createCustomMessageSignature = async (item: ICreateUserSignature) =>
  voticoAxiosInstance
    .put<ICreateUserSignature>('message-signature', { ...item })
    .then((data) => data.data);

export const hardwareLogin = async ({
  signature,
  xPub,
  fingerPrint,
  derivation,
  network,
  walletType,
}: {
  signature: string;
  xPub: string;
  fingerPrint: string;
  derivation: string;
  network: string;
  walletType: WalletType;
}) => {
  // try {
  const response = await voticoAxiosInstance.post('/auth/hardware', {
    signature,
    xPub,
    fingerPrint,
    derivation,
    walletType,
  });
  const token = response.data.data;
  const storageKeys = getStorageKeysForNetwork(network);
  localStorage.setItem(storageKeys.walletClass, token.walletClass);
  localStorage.setItem(storageKeys.voticoToken, token.jwtToken);
  localStorage.setItem(storageKeys.voticoRefresh, token.refreshToken.refreshToken);
  voticoAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.jwtToken}`;
  // } catch (error) {
  //   console.error(error);
  // }
};

export const getMultisigUsers = async (id: string) =>
  voticoAxiosInstance
    .get<GetMultisigUsersResponse>(`/multi-sigs/users/${id}`, {})
    .then((data) => data.data);
