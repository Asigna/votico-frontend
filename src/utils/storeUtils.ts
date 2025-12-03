import { atomWithStorage as atomWithStorageForObject } from 'jotai/utils';

export function atomWithStorage<T = string>(
  key: string,
  initialValue: T,
  storageOptions?: Parameters<typeof atomWithStorageForObject<T>>[2]
) {
  return atomWithStorageForObject<T>(
    key,
    initialValue,
    storageOptions || {
      setItem: (key, newValue) => localStorage.setItem(key, String(newValue)),
      getItem: (key, initialValue) => {
        const value = localStorage.getItem(key);
        !value && localStorage.setItem(key, String(initialValue));

        return localStorage.getItem(key) as T;
      },
      removeItem: (key) => localStorage.removeItem(key),
    }
  );
}
