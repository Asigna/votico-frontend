import React, { startTransition } from 'react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';

import { Avatar } from '@components';
import { Text, Button, Skeleton } from '@kit';
import { Project } from '@pages/utils/types';
import checkIcon from '@images/check.svg';
import paths from '@constants/paths.ts';

import useProjectItem from './util/useProjectItem';
import s from './index.module.scss';

export const ProjectItem: React.FC<
  Project & { onClickButton: (id: string, status: boolean) => void }
> = React.memo((props) => {
  const { avatar, name, membersCount, isMember, _id } = props;
  const { handleClickButton, shortCount } = useProjectItem(props);
  const navigate = useNavigate();

  return (
    <div
      className={cx(
        s.wrap,
        'p-24 flex flex-col items-center rounded-[12rem] cursor-pointer transition border-[.5px] border-white-10 animate-bottom-top'
      )}
      onClick={() => {
        startTransition(() => {
          navigate(`/${paths.TIMELINE}/${_id}`);
        });
      }}
    >
      <Avatar size={80} src={avatar} uniqueString={_id} />
      <Text message={name} className="mt-20 text-center" size="m16" sizeSm="r14" color="white" />
      <Text
        message={membersCount === 1 ? `${shortCount} member` : `${shortCount} members`}
        className="mt-8"
        size="r14"
        color="regular"
      />
      <Button
        type="button"
        message={isMember ? 'Joined' : 'Join'}
        colorType={isMember ? 'inherit' : 'secondary'}
        className="mt-24 w-full"
        rightIcon={isMember ? checkIcon : null}
        onClick={handleClickButton}
      />
    </div>
  );
});

type SkeletonProjectItemProps = {
  isFilled: boolean;
};

export const SkeletonProjectItem: React.FC<SkeletonProjectItemProps> = React.memo((props) => {
  const { isFilled } = props;
  return (
    <div
      className={cx(
        s.wrap,
        isFilled ? 'bg-white-3' : 'bg-white-5',
        'border-[.5px] border-white-10 p-24 flex flex-col items-center rounded-[8rem] transition'
      )}
    >
      <Skeleton width="80rem" height="80rem" className="bg-inherit rounded-[40rem]" />
      <Skeleton width="100%" height="26rem" className="mt-20" />
      <Skeleton width="100%" height="24rem" className="mt-8" />
      <Skeleton width="100%" height="48rem" className="mt-24 w-full" />
    </div>
  );
});
