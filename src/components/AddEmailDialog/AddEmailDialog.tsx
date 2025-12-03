import React, { useEffect, useState } from 'react';
import PinField from 'react-pin-field';
import axios from 'axios';
import cx from 'classnames';
// import { isValidEmail } from 'utils/helper';
import {
  EmailMultisigSettingsResponse,
  unlinkSafeEmail,
  updateSafeEmail,
  verifySafeEmail,
} from '@api/email';
import { Button, Input, Text } from '@kit';
import { isValidEmail } from '@utils';

import s from './index.module.scss';
import { useAtom } from 'jotai';
import { userEmailAtom } from '@store';

interface TransactionCommonProps {
  currentMail: string;
  onClose: (shouldReload?: boolean) => void;
  onSuccess: (response: EmailMultisigSettingsResponse) => void;
}

// TODO split steps into separate components
export const AddEmailDialog: React.FC<TransactionCommonProps> = ({
  currentMail,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [emailValue, setEmailValue] = useState(currentMail);
  const [emailPinCode, setEmailPinCode] = useState('');
  const [resendTimerValue, setResendTimerValue] = useState(0);
  const [isConfirm, setConfirm] = useState(false);
  const [errorConfirm, setErrorConfirm] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [, setUserEmail] = useAtom(userEmailAtom);

  useEffect(() => {
    if (resendTimerValue > 0) {
      const interval = setInterval(() => {
        setResendTimerValue((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendTimerValue]);

  const handleGoBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      onClose();
    }
  };

  const handleProceed = async () => {
    setLoading(true);
    await updateSafeEmail(emailValue, currentMail ? 'replace' : 'set').then(() => {
      setCurrentStep(2);
      setResendTimerValue(60);
      setLoading(false);
    });
  };

  const handleResend = async () => {
    await updateSafeEmail(emailValue.trim(), currentMail ? 'replace' : 'set').then(() => {
      // toast(
      //   () => (
      //     <NotificationCard
      //       title="Email verification"
      //       message="Confirmation code was sent successfully"
      //       type="success"
      //     />
      //   ),
      //   {
      //     className: 'w-full',
      //   }
      // );
      setResendTimerValue(60);
    });
  };

  useEffect(() => {
    setErrorConfirm('');

    if (emailPinCode.length !== 6) {
      return;
    }

    const checkPinCode = async () => {
      const isReplace = Boolean(currentMail);

      await verifySafeEmail(emailValue, emailPinCode, isReplace ? 'replace' : 'set').then(
        (response) => {
          setUserEmail(emailValue);
          onSuccess(response);
          onClose();
        }
      );
    };

    const validatePinCode = async () => {
      setConfirm(false);
      setLoading(true);

      try {
        await checkPinCode().then(() => {
          setConfirm(true);
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const backendMessage = error.response?.data?.message;
          if (backendMessage) {
            setErrorConfirm(backendMessage);
          } else {
            console.error('Error creating subscription order:', error.message);
            setErrorConfirm('Error verifying');
          }
        } else {
          console.error('Unknown error:', error);
          setErrorConfirm('Error verifying');
        }
      } finally {
        setLoading(false);
      }
    };

    validatePinCode();
  }, [currentMail, emailPinCode, emailPinCode.length, emailValue, onClose, onSuccess]);

  const handleDeleteEmail = () => {
    unlinkSafeEmail(currentMail).then(() => {
      setUserEmail('');
      onClose(true);
    });
  };

  const isSecondStepDisabled =
    emailValue.length === 0 ||
    !isValidEmail(emailValue) ||
    (currentMail && currentMail === emailValue.trim());

  return (
    <div
      className={cx(
        'rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] sm:min-w-[456rem] flex flex-col gap-24 border-[.5px] border-white-10 overflow-y-auto mx-16 sm:mx-0',
        s.wrap
      )}
    >
      <div className="flex flex-col gap-32">
        <Text
          message={
            currentStep === 1 ? (currentMail ? 'Change email' : 'Add email') : 'Verify email'
          }
          size="s22"
        />

        {currentStep === 1 && (
          <div className="flex w-full flex-col gap-24">
            <div className="flex w-full flex-col items-start gap-16">
              <Input
                label="Enter email"
                value={emailValue}
                placeholder="email@example.com"
                type="email"
                onChange={(e) => {
                  setEmailValue(e.target.value);
                }}
              />
              {Boolean(currentMail) && (
                <Button message="Delete email" colorType="secondary" onClick={handleDeleteEmail} />
              )}
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex w-full flex-col gap-24 items-center">
            <div className="flex w-full flex-col gap-12 items-center">
              <span className="text-r14">Enter the verification code we sent on {emailValue}</span>
              <button
                className={cx('text-r14', resendTimerValue > 0 ? 'text-regular' : 'text-primary')}
                onClick={handleResend}
                disabled={resendTimerValue > 0}
              >
                Resend
                {resendTimerValue > 0 ? ` (${resendTimerValue})` : ''}
              </button>
            </div>
            <div className="flex w-full gap-8 items-center justify-center">
              <PinField
                length={6}
                onChange={setEmailPinCode}
                className={cx(
                  'flex items-center justify-center rounded-[8px] w-56 h-48 border-[.5px] bg-[#242426] text-center text-[20px]',
                  'border-[#2A2B30] active:outline-none focus-visible:outline-none active:border-[#E5611F] focus-visible:border-primary'
                )}
              />
            </div>
            <span className="text-r14 text-error">{errorConfirm}</span>
          </div>
        )}

        <div className="flex items-center gap-16 w-full">
          <Button
            message={currentStep === 1 ? 'Cancel' : 'Back'}
            onClick={handleGoBack}
            colorType="secondary"
            fullWidth
          />
          <Button
            message="Proceed"
            onClick={handleProceed}
            colorType="primary"
            fullWidth
            disabled={
              (currentStep === 1 && isSecondStepDisabled) ||
              (currentStep === 2 && !isConfirm) ||
              isLoading
            }
            leftIcon={isLoading ? '/loading-gif.gif' : undefined}
          />
        </div>
      </div>
    </div>
  );
};
