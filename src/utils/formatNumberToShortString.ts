export const formatNumberToShortString = (num: number) => {
  if (num < 1000) {
    return `${num}`;
  } else if (num < 1000000) {
    return `${(num / 1000).toFixed(0)}k`;
  } else if (num < 1000000000) {
    return `${(num / 1000000).toFixed(0)}M`;
  } else {
    return `${(num / 1000000000).toFixed(0)}B`;
  }
};
