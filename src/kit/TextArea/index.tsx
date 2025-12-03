import React, { ChangeEvent } from 'react';
import cx from 'classnames';

import { Text } from '../Text';
import { Image } from '../Image';
import targetIcon from '@images/target.svg';
import external from '@images/external.svg';

import s from './index.module.scss';

export type TextAreaProps = {
  value?: string;
  label?: string;
  disabled?: boolean;
  showLimits?: boolean;
  isShowFileUploader?: boolean;
  fullWidth?: boolean;
  limit?: number;
  placeholder?: string;
  error?: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
  footerText?: string;
  onFooterClick?: () => void;
};

export const TextArea: React.FC<TextAreaProps> = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
    const {
      value,
      label,
      placeholder = '',
      className,
      disabled = false,
      isShowFileUploader,
      limit,
      fullWidth,
      error,
      onChange,
      onKeyDown,
      onKeyUp,
      footerText,
      onFooterClick,
      ...rest
    } = props;

    return (
      <div
        className={cx(
          'relative flex flex-col items-start w-full gap-8',
          fullWidth ? 'w-full' : '',
          disabled ? 'opacity-30 pointer-events-none' : '',
          className
        )}
      >
        {(!!limit || label) && (
          <div className="flex justify-between self-stretch">
            {Boolean(label) && <Text message={label as string} size="m14" color="regular" />}
            {Boolean(limit) && (
              <Text message={`${(value || '').length} / ${limit}`} size="m14" color="regular" />
            )}
          </div>
        )}
        <div
          className={cx(
            'relative flex flex-col items-center self-stretch rounded-[8rem] border border-white-10 bg-white-3',
            error ? 'border-red bg-red-10' : ''
          )}
        >
          <textarea
            className={cx(
              s.textarea,
              'flex flex-1 w-full min-h-[148rem] text-r14 rounded-[8rem] px-16 py-[12rem]',
              error ? 'outline-red bg-red-10' : ''
            )}
            disabled={disabled}
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            defaultValue={value}
            ref={ref}
            {...rest}
          />
          {footerText && onFooterClick && (
            <div
              className="flex justify-between items-center mt-[12rem] px-16 py-[12rem] cursor-pointer w-full border-t border-white-10"
              onClick={onFooterClick}
            >
              <Text className="font-normal" message={footerText} size="m14" />
              <Image src={targetIcon} size={16} />
            </div>
          )}
          {isShowFileUploader && (
            <label className="py-12 px-16 w-full border-t border-white-10 cursor-pointer flex items-center justify-between">
              <Text
                message="Attach images by dragging & dropping, selecting or pasting them."
                size="r14"
                color="regular"
              />
              <Image src={external} size={16} color="white" />
              <input type="file" className="hidden" />
            </label>
          )}
        </div>
        {!!error && <Text message={error} size="m14" color="red" />}
      </div>
    );
  })
);

TextArea.displayName = 'TextArea';
