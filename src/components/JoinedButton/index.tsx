import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import { Button } from '@kit';
import arrowIcon from '@images/arrow.svg';
import exitIcon from '@images/exit.svg';

import s from './index.module.scss';

type DisConnectButtonProps = {
  message: string;
  colorType?: 'primary' | 'secondary' | 'inherit';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const JoinedButton: React.FC<DisConnectButtonProps> = React.memo((props) => {
  const { message, colorType = 'primary', onClick } = props;
  const [isOpen, setOpen] = useState(false);

  const handleCloseMenu = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, [setOpen]);

  const handleDropClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (message === 'Join') {
        setOpen(false);
        onClick && onClick(event);
      } else {
        handleCloseMenu();
      }
    },
    [handleCloseMenu, message, onClick]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setOpen(false);
      onClick && onClick(event);
    },
    [onClick]
  );

  return (
    <div className="relative">
      <Button
        className="border-[.5px] bg-white-10 border-white-10 rounded-[8rem] py-8 px-[14rem] flex justify-center items-center gap-8 cursor-pointer w-full"
        message={message}
        hoverMessage={undefined}
        colorType={colorType}
        rightIcon={message !== 'Join' ? arrowIcon : null}
        iconClassName={cx('transition', isOpen ? 'rotate-180' : 'rotate-0')}
        size="sm"
        onClick={handleDropClick}
      />
      {isOpen && <div className="fixed inset-x-0 inset-y-0 z-0" onClick={handleCloseMenu} />}
      {isOpen && (
        <Button
          className={cx(
            s.dropdownWrapper,
            'absolute z-10 right-0 top-[44rem] flex justify-center items-center px-16 py-8 cursor-pointer rounded-[22rem] gap-8 w-full border-[.5px] border-white-30'
          )}
          message="Leave"
          colorType={colorType}
          leftIcon={exitIcon}
          size="sm"
          onClick={handleClick}
        />
      )}
    </div>
  );
});
