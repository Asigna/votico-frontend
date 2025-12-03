import React from 'react';
import cx from 'classnames';

import { Image } from '@kit';
import closeIcon from '@images/close.svg';

import s from './index.module.scss';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  isShow: boolean;
};

export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const { children, onClose, isShow } = props;

  const handleBackdropClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isShow) {
    return null;
  }

  return (
    <div
      className={cx(
        s.wrap,
        'fixed w-full h-full top-0 left-0 flex justify-center items-center z-20'
      )}
      onClick={handleBackdropClick}
    >
      <div className={cx(s.content, 'relative')} onClick={handleContentClick}>
        <button className="absolute right-24 top-24 z-10" onClick={handleBackdropClick}>
          <Image src={closeIcon} size={24} />
        </button>
        {children}
      </div>
    </div>
  );
});
