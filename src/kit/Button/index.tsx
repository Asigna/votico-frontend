import React from 'react';
import cx from 'classnames';

import { Text } from '../Text';
import { Image, type Color } from '../Image';

import s from './index.module.scss';

const ButtonSizeValues = {
  sm: 40,
  md: 48,
  lg: 56,
};

export type ButtonProps = {
  shape?: 'square' | 'circle';
  size?: keyof typeof ButtonSizeValues;
  colorType?: 'primary' | 'secondary' | 'inherit';
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  message?: string;
  hoverMessage?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconSize?: number;
  colorIcon?: Color;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
      className,
      iconClassName,
      size = 'md',
      shape = 'square',
      disabled = false,
      message,
      hoverMessage,
      leftIcon,
      rightIcon,
      fullWidth,
      onClick,
      type = 'button',
      iconSize = 20,
      colorType = 'primary',
      colorIcon,
      ...rest
    } = props;

    return (
      <button
        disabled={disabled}
        className={cx(
          'flex cursor-pointer items-center justify-center transition gap-4',
          shape === 'square' ? 'rounded-[8rem]' : 'rounded-[40rem]',
          message ? 'px-12 sm:px-24' : 'px-12',
          s.button,
          s[colorType],
          s[`size-${size}`],
          {
            'w-full': fullWidth,
            [s.disabled]: disabled,
            [s.hoverMessage]: Boolean(hoverMessage),
          },
          className
        )}
        ref={ref}
        type={type}
        onClick={onClick}
        {...rest}
      >
        {Boolean(leftIcon) && (
          <Image src={leftIcon} size={iconSize} color={colorIcon} className={iconClassName} />
        )}
        {Boolean(message) && (
          <Text
            size="m14"
            message={message as string}
            color="inherit"
            className={cx(s.overTxt, disabled ? 'opacity-50' : '')}
          />
        )}
        {Boolean(hoverMessage) && (
          <Text
            size="m14"
            message={hoverMessage as string}
            color="inherit"
            className={cx(s.underTxt, disabled ? 'opacity-50' : '')}
          />
        )}
        {Boolean(rightIcon) && (
          <Image src={rightIcon} size={iconSize} color={colorIcon} className={iconClassName} />
        )}
      </button>
    );
  })
);

Button.displayName = 'Button';
