import { useRef, useState } from 'react';
import BitcoinApp from 'ledger-bitcoin';
import { useObservable, useSubscription } from 'observable-hooks';
import { catchError, delay, map, mergeMap, of, retry, Subject, tap } from 'rxjs';

// eslint-disable-next-line no-restricted-syntax
export enum LedgerConnectionErrors {
  FailedToConnect = 'FailedToConnect',
  AppNotOpen = 'AppNotOpen',
  AppVersionOutdated = 'AppVersionOutdated',
  DeviceNotConnected = 'DeviceNotConnected',
  DeviceLocked = 'DeviceLocked',
}

interface UseRequestLedgerKeysArgs<App> {
  chain: string;
  isAppOpen(args: { name: string }): boolean;
  getAppVersion(app: App): Promise<{
    name: string;
    version: string;
    flags: number | Buffer;
  }>;
  connectApp(): Promise<App>;
  pullKeysFromDevice(app: BitcoinApp): Promise<void>;
  onSuccess(): void;
  onPullKeysError?: (e: Error) => void;
}

export function useRequestLedgerKeys<App extends BitcoinApp>({
  connectApp,
  getAppVersion,
  pullKeysFromDevice,
  isAppOpen,
  onSuccess,
  onPullKeysError,
}: UseRequestLedgerKeysArgs<App>) {
  const [outdatedAppVersionWarning, setAppVersionOutdatedWarning] = useState(false);
  const [latestDeviceResponse, setLatestDeviceResponse] = useState<{
    targetId?: string;
    deviceLocked?: boolean;
  }>();
  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);
  const [awaitingAppConnection, setAwaitingAppConnection] = useState(true);
  const [awaitingAppKeys, setAwaitingAppKeys] = useState(true);

  const pullKeysAction$ = useObservable(() => new Subject());
  const appConnectionAction$ = useObservable(() => new Subject());
  const appRef = useRef<BitcoinApp>();

  const waitForDeviceConnection = async () => {
    try {
      setAwaitingDeviceConnection(true);
      const app = await connectApp();
      appRef.current = app;

      return app;
    } catch (e) {
      throw new Error(LedgerConnectionErrors.FailedToConnect);
    } finally {
      setAwaitingDeviceConnection(false);
    }
  };

  const checkForAppConnection$ = useObservable(() => {
    return appConnectionAction$.pipe(
      mergeMap(() => {
        return of({}).pipe(
          tap(() => {
            setAwaitingAppConnection(true);
          }),
          delay(1250),
          mergeMap(() => waitForDeviceConnection()),
          mergeMap((app) => getAppVersion(app)),
          map((response) => {
            if (!isAppOpen(response)) {
              throw new Error(LedgerConnectionErrors.AppNotOpen);
            } else {
              setAwaitingAppConnection(false);
            }
          }),
          catchError(() => {
            throw new Error(LedgerConnectionErrors.DeviceLocked);
          }),
          retry()
        );
      })
    );
  });

  const pullKeys$ = useObservable(() => {
    return pullKeysAction$.pipe(
      mergeMap(() => {
        return of({}).pipe(
          tap(() => {
            setAwaitingAppKeys(true);
          }),
          mergeMap(() => getAppVersion(appRef.current as App)),
          map((response) => {
            if (!isAppOpen(response)) {
              throw new Error(LedgerConnectionErrors.AppNotOpen);
            }
          }),
          mergeMap(() => pullKeysFromDevice(appRef.current as BitcoinApp)),
          tap(() => {
            onSuccess?.();
            setAwaitingAppKeys(false);
          }),
          catchError((e) => {
            onPullKeysError?.(e);
            setAwaitingDeviceConnection(true);

            return Promise.resolve();
          })
        );
      })
    );
  });

  useSubscription(pullKeys$);
  useSubscription(checkForAppConnection$);

  return {
    async requestKeys() {
      pullKeysAction$.next(undefined);
    },
    async checkForAppConnection() {
      return appConnectionAction$.next(undefined);
    },
    outdatedAppVersionWarning,
    setAppVersionOutdatedWarning,
    latestDeviceResponse,
    setLatestDeviceResponse,
    awaitingDeviceConnection,
    awaitingAppConnection,
    awaitingAppKeys,
    setAwaitingDeviceConnection,
    waitForDeviceConnection,
  };
}
