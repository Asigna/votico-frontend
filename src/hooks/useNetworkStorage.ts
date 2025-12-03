const NETWORK_STATE_KEY = 'network';

export const useNetworkStorage = () => ({
  getNetwork: (defaultNetwork = 'mainnet') =>
    localStorage.getItem(NETWORK_STATE_KEY) || defaultNetwork,
  setNetwork: (newValue: string) => localStorage.setItem(NETWORK_STATE_KEY, newValue),
});
