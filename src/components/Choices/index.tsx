import React, { useEffect, useState } from 'react';

import { ReactSortable } from 'react-sortablejs';

import cx from 'classnames';
import s from './index.module.scss';

import { Text, Image, Input } from '@kit';
import dragIcon from '@images/drag.svg';
import trashIcon from '@images/trash.svg';

type ChoicesProps = {
  choices: ChoiceItemType[];
  className?: string;
  disabled?: boolean;
  onChange: (items: ChoiceItemType[]) => void;
};
type ChoiceItemType = {
  id: number;
  name: string;
};
export const Choices: React.FC<ChoicesProps> = React.memo((props) => {
  const { choices, className, disabled, onChange } = props;
  const [items, setItems] = useState<ChoiceItemType[]>([...choices]);

  const onAddHandle = () => {
    setItems((prevState) => [...prevState, { id: items.length + 1, name: '' }]);
  };

  const onDeleteHandle = (id: number) => {
    setItems((prevState) => [...prevState.filter((item) => item.id !== id)]);
  };

  const onEditHandle = (id: number, value: string) => {
    setItems((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  useEffect(() => {
    onChange(items);
  }, [items]);

  return (
    <div
      className={cx(
        'rounded-[12rem] px-16 sm:px-24 p-24 bg-white-3 flex flex-col gap-16 border-[.5px] border-white-10',
        className
      )}
    >
      <Text size="s22" message="Options" font="titillium" />
      {disabled ? (
        <div className="flex flex-col gap-8">
          {items.map((item) => (
            <Text
              key={item.id}
              message={item.name}
              size="s16"
              className="border border-white-10 bg-white-3 rounded-[8rem] h-48 flex items-center px-16"
            />
          ))}
        </div>
      ) : (
        <ReactSortable list={items} setList={setItems} className="flex flex-col gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-[8rem] items-center px-16 py-8 flex gap-16 bg-white-3 border-[.5px] border-white-10"
            >
              <div className="flex gap-8">
                <Image src={dragIcon} size={24} className="cursor-grab" />
                <Text size="m14" message={`Choice ${index + 1}`} className="text-nowrap" />
              </div>
              <Input
                placeholder="Type something"
                className={cx(s.input, 'h-32 max-w-none')}
                onChange={(e) => onEditHandle(item.id, (e.target as HTMLInputElement).value)}
                value={item.name}
              />
              <div onClick={() => onDeleteHandle(item.id)} className="cursor-pointer">
                <Image src={trashIcon} size={12} />
              </div>
            </div>
          ))}
        </ReactSortable>
      )}
      {!disabled && (
        <div
          className="rounded-[8rem] items-center px-16 h-[48rem] flex justify-center cursor-pointer border-[.5px] border-dashed border-primary bg-white-5 mt-[-8px]"
          onClick={onAddHandle}
        >
          + Add choice
        </div>
      )}
    </div>
  );
});
