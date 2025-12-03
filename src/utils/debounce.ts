export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  timeout = 300
): ((...args: T) => void) => {
  let timer: NodeJS.Timeout | null;
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};
