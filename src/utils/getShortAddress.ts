export const getShortAddress = (address: string): string => {
  if (address.length > 10) {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  } else {
    return address;
  }
};
