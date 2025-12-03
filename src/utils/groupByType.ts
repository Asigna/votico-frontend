import { Asset, Strategy } from '@pages/utils/types';

export const groupByType = (strategy: Strategy[]): Record<string, Asset[]> => {
  return strategy.reduce(
    (acc, strategy) => {
      if (!strategy.asset) {
        return acc;
      }
      if (!acc[strategy.asset.type]) {
        acc[strategy.asset.type] = [];
      }
      acc[strategy.asset.type].push(strategy.asset);
      return acc;
    },
    {} as Record<string, Asset[]>
  );
};
