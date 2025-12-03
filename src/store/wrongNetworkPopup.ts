import { atom, useAtom } from 'jotai';

const wrongNetworkPopupShownAtom = atom(false);
const wrongNetworkPopupOptionsAtom = atom({ noButton: false, text: '', autoHide: true });

export const useWrongNetworkPopup = () => {
  const [wrongNetworkPopupShown, setWrongNetworkPopupShown] = useAtom(wrongNetworkPopupShownAtom);
  const [wrongNetworkPopupOptions, setWrongNetworkPopupOptions] = useAtom(
    wrongNetworkPopupOptionsAtom
  );

  return {
    wrongNetworkPopupShown,
    setWrongNetworkPopupShown,
    showWrongNetworkPopup: () => setWrongNetworkPopupShown(true),
    hideWrongNetworkPopup: () => setWrongNetworkPopupShown(false),
    wrongNetworkPopupOptions,
    setWrongNetworkPopupOptions,
  };
};
