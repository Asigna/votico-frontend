import React, { useState } from 'react';
import cx from 'classnames';

import { Text } from '../Text';
import { Image } from '../Image';
import checkIcon from '@images/check.svg';
import arrowIcon from '@images/arrow.svg';
import closeIcon from '@images/close.svg';

import s from './index.module.scss';

export type DropdownProps = {
  selected: string[];
  items: string[];
  label?: string;
  placeHolder?: string;
  isMultiple?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  error?: string;
  className?: string;
  messageByItemList?: Record<string, string>;
  onChange: (el: string[]) => void;
  leftIcon?: React.ReactNode;
  mobileView?: boolean;
};

export const Dropdown: React.FC<DropdownProps> = React.memo((props) => {
  const {
    items,
    selected,
    label,
    placeHolder = '',
    isMultiple = false,
    className,
    disabled = false,
    fullWidth,
    error,
    onChange,
    leftIcon,
    messageByItemList,
    mobileView = false,
  } = props;

  const [isOpen, setOpen] = useState(false);

  const handleItemClick = (item: string) => {
    if (isMultiple) {
      const index = selected.indexOf(item);
      if (index > -1) {
        onChange([...selected.slice(0, index), ...selected.slice(index + 1)]);
      } else {
        onChange([...selected, item]);
      }
    } else {
      onChange([item]);
    }
    setOpen(false);
  };

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
      <div
        className={cx(
          'relative flex items-center justify-between self-stretch rounded-[8rem] px-16 py-[11rem] cursor-pointer min-h-48 border',
          disabled ? 'opacity-30 pointer-events-none' : '',
          isOpen ? 'border-white-20 bg-white-5' : 'border-white-10 bg-white-3',
          isMultiple && 'p-8'
        )}
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <div className="flex items-center gap-8">
          {Boolean(leftIcon) && <Image src={leftIcon} size={20} />}
          {isMultiple ? (
            <div className="flex items-start gap-8">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-[4rem] px-12 py-4 bg-white-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    <Text className="font-normal" message={item} size="m14" />
                    <Image src={closeIcon} size={14} className="cursor-pointer" />
                  </div>
                ))
              ) : (
                <div className={cx(s.placeholder, 'flex items-center py-4 ml-8')}>
                  <Text className="font-normal" message={placeHolder} size="m14" color="regular" />
                </div>
              )}
            </div>
          ) : (
            <Text
              className={cx('font-normal', mobileView ? 'hidden sm:flex' : '')}
              message={
                messageByItemList ? messageByItemList[selected.join(', ')] : selected.join(', ')
              }
              size="m14"
            />
          )}
        </div>
        {!mobileView && (
          <Image
            src={arrowIcon}
            size={20}
            className={cx('transition', isOpen ? 'rotate-180' : 'rotate-0')}
          />
        )}
      </div>
      {error && <Text message={error} size="m14" color="red" />}
      {isOpen && (
        <div className={cx(s.bg, 'fixed inset-x-0 inset-y-0 z-0')} onClick={() => setOpen(false)} />
      )}
      {isOpen && (
        <div
          className={cx(
            s.dropdownWrapper,
            'flex flex-col item-start self-stretch rounded-[8rem] py-4 absolute z-10 top-[52rem] border border-white-10 bg-white-5',
            label && 'top-[75rem]',
            mobileView ? 'w-[212rem] right-0' : 'w-full'
          )}
        >
          {items.map((item) => {
            const itemSelected = selected.includes(item);
            return (
              <div
                key={item}
                className="flex justify-between items-center w-full px-16 py-8 cursor-pointer hover:bg-white-5"
                onClick={() => handleItemClick(item)}
              >
                <Text
                  className="font-normal"
                  message={messageByItemList ? messageByItemList[item] : item}
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

Dropdown.displayName = 'Dropdown';
