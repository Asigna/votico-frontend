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

// VITE_API_URL overrides the hostname rule, for previews against a non-default backend.
export const apiUrl = import.meta.env.VITE_API_URL || `https://api.${getAppName()}/api/v1/`;

export const voticoAxiosInstance = axios.create({
  baseURL: apiUrl,
});

export const refreshAxios = axios.create({ baseURL: apiUrl });
