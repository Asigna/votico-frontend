import React from 'react';
import cx from 'classnames';

import { Text } from '../../kit/Text';
import useConnectors from '../../hooks/useConnectors';

import ConnectorItem from './ConnectorItem';

import s from './index.module.scss';

const ConnectWalletModal: React.FC = () => {
  const connectors = useConnectors();

  return (
    <div className={cx(s.wrap, 'rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] mx-16 sm:mx-0')}>
      <Text message="Connect wallet" size="s22" />
      <div className="grid grid-cols-2 gap-12 mt-24">
        {connectors
          .filter((connector) => connector.isExtension)
          .map((connector) => (
            <ConnectorItem key={connector.title} item={connector} />
          ))}
      </div>
      <Text
        message="Hardware/Desktop wallets"
        color="regular"
        className={cx(s.separator, 'text-center mt-24 relative')}
      />
      <div className="grid grid-cols-2 gap-12 mt-16">
        {connectors
          .filter((connector) => !connector.isExtension)
          .map((connector) => (
            <ConnectorItem key={connector.title} item={connector} />
          ))}
      </div>
    </div>
  );
};

export default React.memo(ConnectWalletModal);
