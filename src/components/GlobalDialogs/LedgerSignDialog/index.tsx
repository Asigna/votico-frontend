import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { WalletPolicy } from 'ledger-bitcoin';
import * as bitcoin from 'bitcoinjs-lib';
import { useAtom } from 'jotai';

import LedgerConnectImage from '@images/ledger-connect.png';
import LedgerConfirmImage from '@images/ledger-confirm.png';
import LoadingImage from '@images/loading-gif.gif';
import { Button, Text, Image } from '@kit';
import { currentSafeAtom, getStorageKeysForNetwork, useNetworkObj } from '@hooks';
import { ledgerDialogAtom, useAddress, useNetwork } from '@store';
import { IUser, LedgerConnectErrorType } from '@/types';
import {
  connectLedgerBitcoinApp,
  extractFirstThreeSections,
  getBitcoinAppVersion,
  signLedgerTransaction,
  signTransactionWithSignature,
  useRequestLedgerKeys,
} from '@utils';
import { getMultisigUsers } from '@api/auth';

import s from './index.module.scss';
import { LedgerErrorPopup } from '../LedgerErrorPopup';

type LedgerSignDialogProps = {
  onSuccess: (signedPsbt: string) => void;
  safeId: string;
};

const LedgerSignDialog: React.FC<LedgerSignDialogProps> = (props) => {
  const { onSuccess, safeId } = props;
  const [awaitingSignature, setAwaitingSignature] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [popupError, setPopupError] = useState<LedgerConnectErrorType | null>(null);
  const [owners, setOwners] = useState<IUser[] | []>([]);
  const { network } = useNetwork();
  const [currentSafe] = useAtom(currentSafeAtom);
  const [ledgerDailog] = useAtom(ledgerDialogAtom);
  const networkObj = useNetworkObj();
  const { address } = useAddress();

  const { checkForAppConnection, awaitingAppConnection } = useRequestLedgerKeys({
    chain: 'bitcoin',
    connectApp: connectLedgerBitcoinApp,
    getAppVersion: getBitcoinAppVersion,
    isAppOpen({ name }: { name: string }) {
      return name === 'Bitcoin' || name === 'Bitcoin Test';
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSuccess() {},
    pullKeysFromDevice: () => Promise.resolve(),
  });

  const getMultisigUsersData = async (id: string) => {
    try {
      const usersListData = await getMultisigUsers(id);
      if (usersListData.success && usersListData.data) {
        setOwners(usersListData.data);
      }
    } catch (error) {
      console.error('Fetching MultisigUsers error:', error);
    }
  };

  useEffect(() => {
    getMultisigUsersData(safeId);
    if (currentStep === 1) checkForAppConnection();
  }, [safeId, currentStep, checkForAppConnection]);

  const handleSend = async () => {
    if (!ledgerDailog?.psbtToSign || !currentSafe) return;
    try {
      const bitcoinApp = await connectLedgerBitcoinApp();
      setAwaitingSignature(true);
      const threshold = currentSafe.threshold;
      const ownersHardwareData = ledgerDailog.signParams?.users || [];
      const ownerKeys = ownersHardwareData.map((owner) => {
        return `[${owner.fingerPrint}${extractFirstThreeSections(owner.derivation).replace('m', '')}]${owner.xPub}`;
      });

      const policy = new WalletPolicy(
        `Asigna ${threshold} of ${owners.length} Multisig`,
        `wsh(sortedmulti(${threshold},${ownerKeys.map((_, i) => '@' + i + '/**').join(',')}))`,
        ownerKeys
      );
      let policyId: Buffer;
      let policyHmac: Buffer;
      const storagePolicyKey =
        getStorageKeysForNetwork(network).hardwarePolicyHmac + currentSafe._id;
      const storedPolicy = localStorage.getItem(storagePolicyKey);
      if (storedPolicy) {
        const parsedPolicy = JSON.parse(storedPolicy);
        policyId = Buffer.from(parsedPolicy.policyId, 'hex');
        policyHmac = Buffer.from(parsedPolicy.policyHmac, 'hex');
      } else {
        [policyId, policyHmac] = await bitcoinApp.registerWallet(policy);
        localStorage.setItem(
          storagePolicyKey,
          JSON.stringify({
            policyId: Buffer.from(policyId).toString('hex'),
            policyHmac: Buffer.from(policyHmac).toString('hex'),
          })
        );
      }

      const response = await signLedgerTransaction(bitcoinApp)(
        ledgerDailog.psbtToSign.toBase64(),
        policy,
        policyHmac
      );
      const ownerPubKey = ownersHardwareData.find((o) => o.address === address)?.publicKey || '';
      const signedTx = signTransactionWithSignature(
        bitcoin.Psbt.fromBase64(ledgerDailog.psbtToSign.toBase64(), {
          network: networkObj,
        }),
        ownerPubKey,
        response
      );
      onSuccess(signedTx.toBase64());
    } catch (e) {
      setCurrentStep(1);
    } finally {
      setAwaitingSignature(false);
    }
  };

  const steps = ['Device', 'Confirm'];

  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] sm:min-w-[456rem] border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Sign Transaction" size="s22" />
      <div className="flex justify-between items-center mt-[32rem]">
        {steps.map((step, i) => {
          return (
            <div
              className={cx('flex flex-col justify-center gap-[10rem] items-center', s.stepperItem)}
            >
              <div
                className={cx(
                  s.stepNumber,
                  'flex w-[40rem] h-[40rem] rounded-[40rem] items-center justify-center relative text-center border-[2px] border-white z-2',
                  currentStep < i + 1 && s.stepNumberNext,
                  currentStep > i + 1 && s.stepReady
                )}
              >
                <Text message={i + 1} size="s18" />
              </div>
              <Text message={step} size="r14" />
            </div>
          );
        })}
      </div>
      <div className="flex w-full flex-col items-center gap-32 my-[32rem]">
        {currentStep === 1 && (
          <>
            <Image
              className="max-w-[380rem]"
              fullWidth
              size={{ w: 380, h: 106 }}
              src={LedgerConnectImage}
              alt=""
            />
            <Text message="Open the Bitcoin app on your device" size="s16" color="white" />
            {awaitingAppConnection ? (
              <div className="flex justify-center items-center h-[48rem] gap-8 px-[16rem] py-[13rem]">
                <Image src={LoadingImage} alt="" size={18} />
                <Text message="Waiting for your action" size="r14" color="white" />
              </div>
            ) : (
              <Button
                message="Continue"
                className="mt-24 w-full"
                onClick={() => {
                  if (currentStep === 1) {
                    setCurrentStep(2);
                    handleSend();
                  }
                }}
              />
            )}
          </>
        )}
        {currentStep === 2 && (
          <>
            <Image
              className="max-w-[380rem]"
              fullWidth
              size={{ w: 380, h: 60 }}
              src={LedgerConfirmImage}
              alt=""
            />
            <Text
              message="Please confirm the transaction on your device"
              size="s16"
              color="white"
            />
            {awaitingSignature ? (
              <div className="flex justify-center items-center h-[48rem] gap-8 px-[16rem] py-[13rem]">
                <Image src={LoadingImage} alt="" size={18} />
                <Text message="Waiting for your action" size="r14" color="white" />
              </div>
            ) : (
              <Button message="Continue" className="mt-24 w-full" onClick={() => <></>} />
            )}
          </>
        )}
      </div>
      <LedgerErrorPopup
        open={!!popupError}
        onClose={() => {
          setPopupError(null);
        }}
        typeError={popupError}
      />
    </div>
  );
};

export default React.memo(LedgerSignDialog);
