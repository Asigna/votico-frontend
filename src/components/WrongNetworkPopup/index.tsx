import React, { useEffect, useRef } from 'react';

import { Image } from '../../kit/Image';
import { Text } from '../../kit/Text';

import { useWrongNetworkPopup } from '@store';

import images from './util/images';

interface WrongNetworkPopupProps {
  onClose?: () => void;
}

const WrongNetworkPopup: React.FC<WrongNetworkPopupProps> = ({ onClose }) => {
  const { wrongNetworkPopupShown, hideWrongNetworkPopup, wrongNetworkPopupOptions } =
    useWrongNetworkPopup();

  const handleClose = () => {
    hideWrongNetworkPopup();
    onClose?.();
  };

  const popupRef = useRef({ autoHide: wrongNetworkPopupOptions.autoHide, handleClose });
  useEffect(() => {
    popupRef.current = { autoHide: wrongNetworkPopupOptions.autoHide, handleClose };
  });

  useEffect(() => {
    // Capture each opening's options without restarting its timer on unrelated renders.
    const { autoHide, handleClose } = popupRef.current;
    if (wrongNetworkPopupShown && autoHide) {
      const timerId = setTimeout(() => {
        handleClose();
      }, 3200);

      return () => clearTimeout(timerId);
    }
  }, [wrongNetworkPopupShown]);

  if (!wrongNetworkPopupShown) {
    return null;
  }

  return (
    <div className="rounded-[12rem] p-24 bg-[#18191B] flex fixed top-50 right-50">
      <Image src={images.networkWrong} size={48} />
      <div className="ml-12">
        <Text message="Wrong network" />
        <Text
          message="Networks of the connected wallet and Votico do not match switch wallet to Mainnet"
          color="regular"
        />
      </div>
    </div>
  );
};

const MemoizedWrongNetworkPopup = React.memo(WrongNetworkPopup);
export default MemoizedWrongNetworkPopup;
