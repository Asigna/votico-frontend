import React, { useState } from 'react';

import { Text, Image, Button, Modal } from '@kit';
import { ConnectWalletModal, WrongNetworkPopup } from '@components';
import connectIcon from '@images/connect.svg';

export const Connect: React.FC = () => {
  const [isShowConnectors, setIsShowConnectors] = useState(false);

  return (
    <div className="flex items-center flex-col gap-40 mt-[144rem]">
      <div className="flex items-center flex-col gap-16">
        <Image src={connectIcon} size={40} />
        <Text size="s22" message="Connect wallet" font="titillium" />
        <Text
          size="m14"
          message="Connect your Bitcoin wallet to get access to your projects."
          color="regular"
          font="titillium"
        />
      </div>
      <Button
        className="min-w-[256rem]"
        message="Connect wallet"
        size="md"
        onClick={() => setIsShowConnectors(true)}
      />
      <WrongNetworkPopup />
      <Modal onClose={() => setIsShowConnectors(false)} isShow={isShowConnectors}>
        <ConnectWalletModal />
      </Modal>
    </div>
  );
};
