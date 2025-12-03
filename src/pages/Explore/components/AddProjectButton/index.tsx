import React from 'react';
import cx from 'classnames';

import { Image, Text } from '@kit';
import addIcon from '@images/add.svg';

import s from './index.module.scss';

type AddProjectButtonProps = {
  onClick: () => void;
};

export const AddProjectButton: React.FC<AddProjectButtonProps> = React.memo((props) => {
  const { onClick } = props;
  return (
    <div
      className={cx(
        s.wrap,
        'p-24 flex flex-col justify-center items-center rounded-[12rem] gap-24 self-stretch cursor-pointer transition animate-bottom-top border border-dashed border-primary bg-white-3 hover:bg-white-5'
      )}
      onClick={onClick}
    >
      <div className="w-[80rem] h-[80rem] flex flex-col justify-center items-center rounded-[50%] border-[.5px] border-white-10">
        <Image size={24} src={addIcon} />
      </div>
      <Text message="Create Project" size="m16" />
    </div>
  );
});
