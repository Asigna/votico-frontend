import React from 'react';
import cx from 'classnames';

import { Image } from '../../../kit/Image';
import { Text } from '../../../kit/Text';

import s from './index.module.scss';
import { useWrongNetworkPopup } from '@store';

type ConnectorItem = {
  item: {
    title: string;
    logo: string;
    installed: boolean;
    link: string;
    onConnect: () => Promise<void | { error: string }>;
    isExtension: boolean;
    type: string;
    onClose?: () => void;
    disabled?: boolean;
  };
};
const ConnectorItem: React.FC<ConnectorItem> = (props) => {
  const { title, installed, logo, link, onConnect, onClose, disabled } = props.item;
  const { showWrongNetworkPopup, setWrongNetworkPopupOptions } = useWrongNetworkPopup();

  const handleClick = async () => {
    if (!installed || disabled) {
      return;
    }
    if (typeof onClose === 'function') {
      onClose();
    }

    const result = await onConnect();

    if (result?.error === 'network mismatch') {
      setWrongNetworkPopupOptions({ noButton: false, text: '', autoHide: true });
      showWrongNetworkPopup();
    } else {
      result && console.error(result);
    }
  };

  return (
    <div
      className={cx(
        'h-[48rem] flex items-center justify-center rounded-[8rem] px-12 gap-4',
        disabled ? ' opacity-50' : 'cursor-pointer',
        s.wrap
      )}
      onClick={handleClick}
    >
      <Image src={logo} size={28} alt={title} />
      <Text size="r14" message={title} color="white" />
      {!installed && (
        <Text
          tag="a"
          href={link}
          target="_blank"
          message="Install"
          className={cx(s.badge, 'rounded-[48rem] py-4 px-8 ml-auto')}
        />
      )}
    </div>
  );
};

ConnectorItem.displayName = 'ConnectorItem';
export default React.memo(ConnectorItem);
