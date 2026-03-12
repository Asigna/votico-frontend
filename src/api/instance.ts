import axios from 'axios';

const getAppName = () => {
  const url = location.hostname;

  if (url === 'localhost') {
    return 'dev.voti.co';
  }

  if (url.startsWith('app.')) {
    return url.replace(/^app\./, '');
  }

  return 'voti.co';
};

export const apiUrl = `https://api.${getAppName()}/api/v1/`;

export const voticoAxiosInstance = axios.create({
  baseURL: apiUrl,
});

export const refreshAxios = axios.create({ baseURL: apiUrl });
