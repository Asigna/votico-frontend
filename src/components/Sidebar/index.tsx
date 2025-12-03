import React, { startTransition } from 'react';
import cx from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

import { Avatar } from '@components';
import { Image, Text } from '@kit';

import s from './index.module.scss';

type SideBarItem = {
  _id: string;
  name: string;
  avatar?: string;
};

type SidebarProps = {
  items: SideBarItem[];
  backUrl: string;
  backTitle: string;
  backImage?: string;
  mainUrl?: string;
  className?: string;
  onClickItem?: () => void;
};

export const Sidebar: React.FC<SidebarProps> = React.memo((props) => {
  const { onClickItem, items, backUrl, backTitle, backImage, mainUrl, className } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (item: SideBarItem) => {
    if (
      (item._id && pathname.includes(`/${mainUrl}/${item._id}`)) ||
      (!item._id && pathname === `/${mainUrl}`)
    ) {
      return;
    }

    if (typeof onClickItem === 'function') {
      onClickItem();
    }

    startTransition(() => {
      navigate(item._id ? `/${mainUrl}/${item._id}` : `/${mainUrl}`);
    });
  };

  return (
    <div
      className={cx(
        s.wrapper,
        'sm:max-w-[212rem] sm:pb-36 overflow-y-auto flex sm:block gap-8 items-center mx-[-16rem] sm:mx-0 w-auto sm:w-full',
        className
      )}
    >
      <div className={cx(s.linkWrap, 'rounded-[8rem] sm:bg-white-3 ml-16 sm:ml-0')}>
        <button
          onClick={() =>
            startTransition(() => {
              navigate(backUrl);
            })
          }
          className="p-8 sm:py-12 flex items-center px-16 w-full relative sm:overflow-hidden rounded-[24rem] sm:rounded-[0px] bg-white-3 sm:bg-[transparent]"
        >
          {Boolean(backImage) && <Image src={backImage} size={24} />}
          <Text
            message={backTitle}
            size="m14"
            color="regular"
            className={backImage ? 'ml-12 text-nowrap' : 'text-nowrap'}
          />
        </button>
      </div>
      <div
        className={cx(
          s.linkWrap,
          'sm:py-12 rounded-[8rem] sm:mt-16 sm:bg-white-3 flex gap-8 sm:block'
        )}
      >
        {items.map((item) => {
          const isActive =
            (item._id && pathname.includes(`/${mainUrl}/${item._id}`)) ||
            (!item._id && pathname === `/${mainUrl}`);

          return (
            <button
              onClick={() => handleNavigation(item)}
              key={item._id}
              className={cx(
                { [s.active]: isActive },
                'flex items-center px-16 w-full relative h-[40rem] sm:h-[52rem] bg-white-3 sm:bg-[transparent] sm:hover:bg-white-3 transition rounded-[24rem] sm:rounded-[0px]'
              )}
            >
              {Boolean(item.avatar) && (
                <Avatar uniqueString={item._id} src={item.avatar} size={32} />
              )}
              <Text
                message={item.name}
                size="m14"
                color={isActive ? 'white' : 'regular'}
                className={item.avatar ? 'ml-12 text-nowrap' : 'text-nowrap'}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
