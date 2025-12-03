import React from 'react';

import { LedgerConnectErrorType } from '@/types';
import AlertDisconnectImage from '@images/alert-disconnect.svg';
import AlertLockedImage from '@images/alert-locked.svg';
import AlertUsbImage from '@images/alert-usb.svg';
import { Button, Image, Text } from '@kit';

interface TransactionCommonProps {
  open: boolean;
  onClose: () => void;
  onRetryClick?: () => void;
  typeError: LedgerConnectErrorType | null;
}

export const LedgerErrorPopup = React.memo((props: TransactionCommonProps) => {
  const { open, onClose, typeError, onRetryClick } = props;

  return (
    <>
      {open && (
        <>
          <div className="fixed inset-x-0 inset-y-0" onClick={onClose} />
          <div
            className="flex flex-col items-center rounded-[20rem] w-full z-50 left-0 right-0 max-w-[430rem] px-[32rem] pt-[40rem] pb-[32rem] mx-auto my-0"
            onClick={onClose}
          >
            {typeError === 'Usb' && (
              <div className="flex flex-col items-center gap-16 w-full mb-[32rem]">
                <Image className="shrink-0" src={AlertUsbImage} alt="" size={56} />
                <Text
                  className="text-center"
                  size="s18"
                  message="Failed to connect the device on USB"
                  color="white"
                />
              </div>
            )}
            {typeError === 'Disconnect' && (
              <div className="flex flex-col items-center gap-16 w-full mb-[32rem]">
                <Image className="shrink-0" src={AlertDisconnectImage} alt="" size={56} />
                <Text
                  className="text-center"
                  size="s18"
                  message="Device is disconnected"
                  color="white"
                />
                <Text
                  className="text-center mt-[-12rem]"
                  size="s16"
                  message="Please reconnect to continue"
                  color="white"
                />
              </div>
            )}
            {typeError === 'Locked' && (
              <div className="flex flex-col items-center gap-16 w-full mb-[32rem]">
                <Image className="shrink-0" src={AlertLockedImage} alt="" size={56} />
                <Text className="text-center" size="s18" message="Device is locked" color="white" />
                <Text
                  className="text-center mt-[-12rem]"
                  size="s16"
                  message="Please unlock to continue"
                  color="white"
                />
              </div>
            )}
            <Button message="Retry" className="mt-24 w-full" onClick={onRetryClick} />
          </div>
        </>
      )}
    </>
  );
});
