import React, { ChangeEvent, KeyboardEventHandler } from 'react';
import cx from 'classnames';

import { Image, Text } from '@kit';

import s from './index.module.scss';

type InputProps = {
  leftIcon?: React.ReactNode;
  value?: string;
  placeholder: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  className?: string;
  label?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
};

export const Input: React.FC<InputProps> = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
      leftIcon,
      value,
      placeholder,
      error,
      onChange,
      onKeyUp,
      className,
      label,
      type = 'text',
      disabled = false,
      ...rest
    } = props;

    return (
      <div className={cx('flex items- w-full flex-col', className)}>
        {Boolean(label) && <Text message={label as string} size="m14" color="regular" />}
        <div className={cx('h-[48rem] relative flex items-center w-full', label ? 'mt-8' : '')}>
          {Boolean(leftIcon) && <Image src={leftIcon} size={20} className="absolute left-16" />}
          <input
            className={cx(
              s.input,
              'h-full w-full text-r14 rounded-[8rem] px-16',
              leftIcon ? 'pl-44' : '',
              error ? 'outline-red bg-red-10' : ''
            )}
            type={type}
            defaultValue={value}
            autoComplete="off"
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            onKeyUp={onKeyUp}
            ref={ref}
            {...rest}
          />
        </div>
        {Boolean(error) && (
          <Text message={error as string} size="r14" color="red" className="mt-8" />
        )}
      </div>
    );
  })
);
