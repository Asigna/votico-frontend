import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import AppClient from 'ledger-bitcoin';
import { AddressType } from 'bitcoin-address-validation';

import { hardwareLogin } from '@api/auth';
import { LedgerConnectErrorType } from '@/types';
import { useAddress, useNetwork, useWrongNetworkPopup } from '@store';
import {
  BitcoinNetworkModes,
  IAddressSelection,
  LedgerConnectionErrors,
  WalletScriptType,
  bitcoinNetworkModeToCoreNetworkMode,
  connectLedgerBitcoinApp,
  getBitcoinAppVersion,
  getBitcoinBalance,
  pullBitcoinKeysFromLedgerDevice,
  signLedgerMessage,
  useRequestLedgerKeys,
} from '@utils';
import { getStorageKeysForNetwork } from '@hooks';
import { Button, ComboBox, Text, Image } from '@kit';
import ErrorImage from '@images/icon_error.svg';
import OkImage from '@images/icon-ok.svg';
import LedgerImage from '@images/ledger.png';
import ConnectErrorIcon from '@images/ledger_error_connect.svg';
import ConnectSuccessIcon from '@images/ledger_success_connect.svg';
import LedgerConnectImage from '@images/ledger-connect.png';
import LedgerSignImage from '@images/ledger-sign.png';
import LoadingImage from '@images/loading-gif.gif';

import s from './index.module.scss';
import { LedgerErrorPopup } from '../LedgerErrorPopup';

const steps = ['Connect', 'Device', 'Account', 'Confirm'];
const walletTypes: { type: WalletScriptType; path: string; addressType: AddressType }[] = [
  { type: 'Taproot', path: `m/86'/`, addressType: AddressType.p2tr },
  { type: 'Native Segwit', path: `m/84'/`, addressType: AddressType.p2wpkh },
  { type: 'Nested Segwit', path: `m/49'/`, addressType: AddressType.p2sh },
  { type: 'Legacy', path: `m/44'/`, addressType: AddressType.p2pkh },
];

type LedgerConnectDialogProps = {
  onClose: () => void;
};

const LedgerConnectDialog: React.FC<LedgerConnectDialogProps> = (props) => {
  const { onClose } = props;
  const [, setHasError] = useState(false);
  const [addresses, setAddresses] = useState<IAddressSelection[]>([]);
  const [addressesBalances, setAddressesBalances] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddressSelection>();
  const [selectedWalletType, setSelectedWalletType] = useState<WalletScriptType>(
    walletTypes[0].type
  );
  const [awaitingSignature, setAwaitingSignature] = useState(false);
  const { network } = useNetwork();
  const { address, setAddress } = useAddress();

  const [currentStep, setCurrentStep] = useState(1);
  const [isBegin] = useState(true);
  const walletTypeRef = useRef(selectedWalletType);
  const [signatureError, setSignatureError] = useState('');
  const [popupError, setPopupError] = useState<LedgerConnectErrorType | null>(null);
  const [connected, setConnected] = useState(false);
  const { showWrongNetworkPopup, setWrongNetworkPopupOptions, hideWrongNetworkPopup } =
    useWrongNetworkPopup();

  async function pullKeysFromDevice(app?: AppClient) {
    setAddresses([]);
    if (!app) return;
    const derivationPath =
      walletTypes.find((walletType) => walletType.type === walletTypeRef.current)?.path || '';
    const resp = await pullBitcoinKeysFromLedgerDevice(
      app,
      derivationPath || walletTypes[0].path,
      walletTypes.find((walletType) => walletType.type === walletTypeRef.current)
        ?.addressType as AddressType
    )({
      network: bitcoinNetworkModeToCoreNetworkMode(network as BitcoinNetworkModes),
      // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
      onRequestKey() {},
    });

    if (resp.status === 'failure') {
      setHasError(true);

      return;
    }
    setAddresses(resp.keys);
    setCurrentStep(3);
    setSelectedAddress(resp.keys[0]);
  }

  useEffect(() => {
    const balancePromises = addresses.map((address) => getBitcoinBalance(address.address));
    Promise.all(balancePromises).then((res) =>
      setAddressesBalances(res.map((balace) => balace.btc_amount))
    );
  }, [addresses]);

  const {
    requestKeys,
    awaitingDeviceConnection,
    awaitingAppConnection,
    awaitingAppKeys,
    waitForDeviceConnection,
    checkForAppConnection,
  } = useRequestLedgerKeys({
    chain: 'bitcoin',
    connectApp: connectLedgerBitcoinApp,
    getAppVersion: getBitcoinAppVersion,
    isAppOpen({ name }: { name: string }) {
      const isMainnetAppOpen = name === 'Bitcoin';
      const isTestnetAppOpen = name === 'Bitcoin Test';
      const isOpenCorrectApp =
        (network === 'mainnet' && isMainnetAppOpen) || (isTestnetAppOpen && network === 'testnet');
      if (!isOpenCorrectApp && (isMainnetAppOpen || isTestnetAppOpen)) {
        setWrongNetworkPopupOptions({
          noButton: true,
          text: 'Networks of the opened Apps do not match',
          autoHide: false,
        });
        showWrongNetworkPopup();
      }
      if (isOpenCorrectApp) {
        hideWrongNetworkPopup();
      }

      return isOpenCorrectApp;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSuccess() {},
    pullKeysFromDevice,
    onPullKeysError: (e) => {
      if (LedgerConnectionErrors.AppNotOpen === e.message) {
        setCurrentStep(2);
      } else {
        // setCurrentStep(6);!!!!
        setPopupError('Disconnect');
      }
    },
  });

  useEffect(() => {
    if (currentStep === 2) {
      checkForAppConnection();
    } else if (currentStep === 3) {
      requestKeys();
    } else if (currentStep === 4) {
      handleSelectAddress();
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 5 && connected) {
      setTimeout(() => {
        onClose();
        window.location.href = '/';
      }, 1000);
    }
  }, [currentStep, connected, onClose]);

  const handleSelectAddress = async () => {
    const bitcoinApp = await connectLedgerBitcoinApp();
    setSignatureError('');
    setAwaitingSignature(true);

    if (!selectedAddress) {
      throw new Error('Address not selected');
    }

    try {
      const storageKeys = getStorageKeysForNetwork(network);

      const signature = await signLedgerMessage(bitcoinApp)(
        Buffer.from('Hello Votico!'),
        selectedAddress.derivationPath
      );
      const masterFingerPrint = await bitcoinApp.getMasterFingerprint();
      await hardwareLogin({
        signature,
        xPub: selectedAddress.xpub,
        fingerPrint: masterFingerPrint,
        derivation: selectedAddress.derivationPath,
        network,
        walletType: 'LEDGER',
      });

      await bitcoinApp.transport.close();
      localStorage.setItem(storageKeys.walletType, 'LEDGER');
      localStorage.setItem(storageKeys.ownerPk, selectedAddress.publicKey);
      localStorage.setItem(storageKeys.voticoWalletId, selectedAddress.address);
      setAddress(selectedAddress.address);
      setConnected(true);
    } catch (e) {
      setSignatureError('Error signing message');
      setAwaitingSignature(false);
    } finally {
      setCurrentStep(5);
    }
  };
  const lastStepRef = useRef(0);
  if (currentStep !== 6) {
    lastStepRef.current = currentStep;
  }

  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] sm:min-w-[456rem] border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Connect Ledger" size="s22" />
      {currentStep !== 6 && (
        <>
          <div className="flex justify-between items-center mt-[32rem]">
            {steps.map((step, i) => {
              return (
                <div
                  key={`step-${step}`}
                  className={cx(
                    'flex flex-col justify-center gap-[10rem] items-center',
                    s.stepperItem
                  )}
                >
                  <div
                    className={cx(
                      s.stepNumber,
                      'flex w-[40rem] h-[40rem] rounded-[40rem] items-center justify-center relative text-center border-[2px] border-white z-2',
                      lastStepRef.current < i + 1 && s.stepNumberNext,
                      lastStepRef.current > i + 1 && s.stepReady
                    )}
                  >
                    <Text message={currentStep <= i + 1 ? i + 1 : '✔'} size="s18" />
                  </div>
                  <Text message={step} size="r14" />
                </div>
              );
            })}
          </div>
          <div className="flex w-full flex-col items-center gap-32 my-[32rem]">
            {currentStep === 1 && (
              <Image
                className="max-w-[380rem]"
                fullWidth
                size={{ w: 380, h: 60 }}
                src={LedgerImage}
                alt=""
              />
            )}
            {currentStep === 1 && !awaitingDeviceConnection && (
              <Text message="Connect your unlocked device" size="s16" color="white" />
            )}
            {currentStep === 2 && (
              <>
                <Image
                  className="max-w-[380rem]"
                  fullWidth
                  size={{ w: 380, h: 106 }}
                  src={LedgerConnectImage}
                  alt=""
                />
                <Text
                  message={`Open the Bitcoin ${network === 'testnet' ? 'Test' : ''} app on your device`}
                  size="s16"
                  color="white"
                />
              </>
            )}
            {currentStep === 3 && (
              <div className="flex flex-col items-center gap-24 self-stretch">
                <div className="flex items-start justify-center gap-16 self-stretch">
                  <div className="flex flex-1 flex-col items-start gap-8">
                    <Text message="Select wallet type" size="r14" color="white" />
                    <ComboBox
                      items={walletTypes.map((a) => a.type)}
                      selected={selectedWalletType}
                      onChange={(type) => {
                        walletTypeRef.current = type as WalletScriptType;
                        requestKeys();
                        const newValue = walletTypes.find((a) => a.type === type)?.type;
                        if (newValue) setSelectedWalletType(newValue);
                      }}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="flex items-start justify-center gap-16 self-stretch">
                  <div className="flex flex-1 flex-col items-start gap-8">
                    <Text message="Select account" size="r14" color="white" />
                    <ComboBox
                      loading={awaitingAppKeys}
                      items={addresses.map((a) => a.address)}
                      itemMap={(address) => {
                        if (selectedWalletType === 'Taproot') {
                          return address.slice(0, 20) + '...' + address.slice(-20);
                        }

                        return address;
                      }}
                      rightItems={addressesBalances.map((balance) => balance + ' BTC')}
                      selected={selectedAddress?.address || ''}
                      onChange={(addr) =>
                        setSelectedAddress(addresses.find((a) => a.address === addr))
                      }
                      fullWidth
                      shortAddress
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 4 && awaitingSignature && (
              <>
                <Image
                  className="max-w-[380rem]"
                  fullWidth
                  size={{ w: 380, h: 60 }}
                  src={LedgerSignImage}
                  alt=""
                />
                <Text message="Please sign message on your device" size="s16" color="white" />
              </>
            )}
            {currentStep === 4 && !!signatureError && (
              <div className="flex flex-col gap-16 px-0 py-[8rem] items-center">
                <Image
                  className="max-w-[380rem]"
                  fullWidth
                  size={{ w: 380, h: 60 }}
                  src={OkImage}
                  alt=""
                />
                <Text message={signatureError} size="s16" color="white" />
              </div>
            )}
            {currentStep === 4 && !signatureError && address && (
              <div className="flex flex-col gap-16 px-0 py-[8rem] items-center">
                <Image
                  className="max-w-[380rem]"
                  fullWidth
                  size={{ w: 380, h: 60 }}
                  src={ErrorImage}
                  alt=""
                />
                <Text message={signatureError} size="s16" color="white" />
              </div>
            )}
            {currentStep === 5 && (
              <div className="flex flex-col items-center">
                <img src={connected ? ConnectSuccessIcon : ConnectErrorIcon} alt="" />
                <Text
                  message={connected ? 'Connected' : 'Connection failed. Please start over again.'}
                  size="s16"
                  className="mt-[10rem]"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-16 items-center w-full">
            {(currentStep === 1 && awaitingDeviceConnection) ||
            (currentStep === 2 && awaitingAppConnection) ||
            currentStep === 4 ? (
              <div className="flex justify-center items-center h-[48rem] gap-8 px-[16rem] py-[13rem]">
                <Image src={LoadingImage} alt="" size={18} />
                <Text message="Waiting for your action" size="r14" color="white" />
              </div>
            ) : currentStep === 5 || currentStep === 6 ? undefined : (
              <Button
                message="Continue"
                className="mt-24 w-full"
                onClick={() => {
                  if (currentStep === 1) {
                    waitForDeviceConnection()
                      .then(() => setCurrentStep(2))
                      .catch(() => {
                        setPopupError('Usb');
                        setCurrentStep(6);
                      });
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                disabled={
                  (currentStep === 1 && awaitingDeviceConnection && !isBegin) ||
                  (currentStep === 2 && awaitingAppConnection) ||
                  (currentStep === 3 &&
                    (!selectedAddress || !selectedWalletType || awaitingAppKeys))
                }
              />
            )}
          </div>
        </>
      )}
      {currentStep === 6 && (
        <LedgerErrorPopup
          open={!!popupError}
          onClose={() => {
            setPopupError(null);
            setCurrentStep(1);
          }}
          typeError={popupError}
          onRetryClick={() => {
            setCurrentStep(1);
            waitForDeviceConnection()
              .then(() => setCurrentStep(2))
              .catch(() => {
                setPopupError('Usb');
                setCurrentStep(6);
              });
          }}
        />
      )}
    </div>
  );
};

export default React.memo(LedgerConnectDialog);
