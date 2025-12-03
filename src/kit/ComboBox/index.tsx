import React, { useState } from 'react';
import cx from 'classnames';

import { getShortAddress } from '@utils';
import checkIcon from '@images/check.svg';
import arrowIcon from '@images/arrow.svg';

import { Image } from '../Image';
import { Text } from '../Text';
import s from './index.module.scss';

export type ComboBoxProps = {
  selected: string;
  items: string[];
  label?: string;
  placeHolder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  error?: string;
  className?: string;
  onChange: (el: string) => void;
  leftIcon?: React.ReactNode;
  itemMap?: (val: string) => string;
  rightItems?: string[];
  loading?: boolean;
  shortAddress?: boolean;
};

export const ComboBox: React.FC<ComboBoxProps> = React.memo((props) => {
  const {
    items,
    selected,
    label,
    placeHolder = '',
    className,
    disabled = false,
    fullWidth,
    error,
    onChange,
    leftIcon,
    rightItems,
    itemMap,
    loading,
    shortAddress = false,
  } = props;

  const [isOpen, setOpen] = useState(false);
  const rightItemSelected = rightItems?.[items.indexOf(selected || '')];

  return (
    <div
      className={cx(
        'relative flex flex-col items-start gap-8',
        {
          'w-full': fullWidth,
          [s.disabled]: disabled,
        },
        className
      )}
    >
      {label && <Text message={label} color="regular" size="m14" />}
      {loading ? (
        <div
          className={cx(
            s.selected,
            s.selectedDisabled,
            'relative flex items-center justify-between self-stretch rounded-[8rem] px-16 py-[11rem] cursor-pointer'
          )}
        >
          <Text className="font-normal" message="Loading" size="m14" />
        </div>
      ) : (
        <div
          className={cx(
            'relative flex items-center justify-between self-stretch rounded-[8rem] px-16 py-[11rem] cursor-pointer',
            isOpen ? 'border-white-20 bg-white-5' : 'border-white-10 bg-white-3',
            disabled ? 'opacity-30 pointer-events-none' : ''
          )}
          onClick={() => setOpen((prevState) => !prevState)}
        >
          <div className="flex items-center gap-8">
            {Boolean(leftIcon) && <Image src={leftIcon} size={20} />}
            <Text
              className="font-normal"
              message={itemMap && selected ? itemMap(selected) : selected || placeHolder}
              size="m14"
            />
          </div>
          {rightItemSelected && (
            <div className={cx('openDropDown', s.rightItemText)}>{rightItemSelected}</div>
          )}
          <Image
            src={arrowIcon}
            size={20}
            className={cx('transition', isOpen ? 'rotate-180' : 'rotate-0')}
          />
        </div>
      )}
      {error && <Text message={error} size="m14" color="red" />}
      {isOpen && (
        <div
          className={cx(s.bg, 'fixed inset-x-0 inset-y-0 z-0')}
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      {isOpen && (
        <div
          className={cx(
            s.dropdownWrapper,
            'flex flex-col item-start w-full self-stretch rounded-[8rem] py-4 absolute z-10 top-[52rem] border border-white-10 bg-white-5',
            label && 'top-[75rem]'
          )}
        >
          {items.map((item) => {
            const itemSelected = item === selected;
            return (
              <div
                key={item}
                className="flex justify-between items-center w-full px-16 py-8 cursor-pointer hover:bg-white-5"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <Text
                  className="font-normal"
                  // message={shortAddress ? getShortAddress(item) : item}
                  message={itemMap ? itemMap(item) : shortAddress ? getShortAddress(item) : item}
                  size="m14"
                />
                {itemSelected && <Image src={checkIcon} size={20} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

ComboBox.displayName = 'ComboBox';
