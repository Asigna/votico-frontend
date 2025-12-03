import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import { Button, Image, Modal, Text } from '@kit';
import paths from '@constants/paths';

import {
  exploreIcon,
  timelineIcon,
  iconTextLogo,
  iconVLogo,
  hamburger,
  closeIcon,
  bellIcon,
  // bellNewIcon,
  // newmailImage,
  mailImage,
} from './util/images';
import s from './index.module.scss';
import { DisConnectButton } from '../DisConnectButton';
import { AddEmailDialog } from '../AddEmailDialog';
import { useAtom } from 'jotai';
import { userEmailAtom } from '@store';
import useHeader from '@store/globalDialogs';

// import { EmailMultisigSettingsResponse } from '@/api/email';

type HeaderProps = {
  onLogin?: () => void;
  address: string;
};

type Link = {
  to: string;
  image: string;
  title: string;
};

const links: Link[] = [
  {
    to: paths.EXPLORE,
    image: exploreIcon,
    title: 'Explore',
  },
  {
    to: paths.TIMELINE,
    image: timelineIcon,
    title: 'Timeline',
  },
];

export const Header: React.FC<HeaderProps> = React.memo((props) => {
  const { onLogin, address } = props;
  const location = useLocation();
  useHeader();
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenNotifications, setOpenNotifications] = useState(false);
  const [isShowEmailModal, setShowEmailModal] = useState(false);
  const [userEmail] = useAtom(userEmailAtom);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu((prevState) => !prevState);
  }, [setOpenMenu]);

  const handleCloseNotifications = useCallback(() => {
    setOpenNotifications((prevState) => !prevState);
  }, [setOpenNotifications]);

  return (
    <div
      className={cx(
        s.wrap,
        'flex justify-between items-center w-full fixed top-0 left-0 p-16 sm:p-12 bg-black z-10'
      )}
    >
      <NavLink to={paths.HOME} className="flex gap-8 items-center" reloadDocument>
        <Image src={iconVLogo} size={32} />
        <Image src={iconTextLogo} size={{ w: 70, h: 12 }} className="hidden sm:block" />
      </NavLink>

      <div className="hidden sm:flex items-center gap-32">
        {links.map((link) => {
          const isActive =
            location.pathname.includes(link.to) ||
            (location.pathname === '/' && link.to === 'explore');

          return (
            <NavLink to={`/${link.to}`} key={link.to} className="flex items-center gap-8">
              <Image src={link.image} size={20} color={isActive ? 'white' : 'regular'} />
              <Text message={link.title} size="m14" color={isActive ? 'white' : 'regular'} />
            </NavLink>
          );
        })}
      </div>
      <div className="flex items-center gap-16">
        {address ? (
          <>
            <Button
              leftIcon={bellIcon}
              size="sm"
              colorType="inherit"
              onClick={handleCloseNotifications}
            />
            <DisConnectButton address={address} />
          </>
        ) : (
          <Button
            size="sm"
            message="Connect wallet"
            colorType="primary"
            shape="circle"
            onClick={onLogin}
          />
        )}
        <button onClick={handleCloseMenu} className="flex sm:hidden">
          <Image src={isOpenMenu ? closeIcon : hamburger} size={20} />
        </button>
      </div>
      {isOpenMenu && (
        <>
          <div
            className="fixed inset-0 top-[72rem] bg-[#000] opacity-70 z-10"
            onClick={handleCloseMenu}
          />
          <div className="absolute w-full inset-x-0 top-[72rem] py-16 px-24 bg-[#141517] z-20">
            {links.map((link) => {
              const isActive =
                location.pathname.includes(link.to) ||
                (location.pathname === '/' && link.to === 'explore');

              return (
                <NavLink
                  to={`/${link.to}`}
                  key={link.to}
                  className="flex items-center gap-[6rem] py-16"
                  reloadDocument
                >
                  <Image src={link.image} size={20} color={isActive ? 'white' : 'regular'} />
                  <Text message={link.title} size="m14" color={isActive ? 'white' : 'regular'} />
                </NavLink>
              );
            })}
          </div>
        </>
      )}
      {isOpenNotifications && (
        <>
          <div
            className="fixed inset-0 bg-[#000] opacity-70 z-10"
            onClick={handleCloseNotifications}
          />
          <div className="absolute right-0 top-[72rem] py-16 bg-[#141517] rounded-[8px] z-20">
            <div className="flex flex-col w-full sm:w-[400px]">
              <div className="flex items-center justify-between px-16 mb-8">
                <Text message="Notifications" size="m16" />
                <button className="" onClick={handleCloseNotifications}>
                  <Image src={closeIcon} size={20} />
                </button>
              </div>
              <div className="h-[.5px] bg-white-10" />
              <div className="flex w-full">
                <div className="flex items-center gap-12 px-16 w-full">
                  <Image src={mailImage} size={32} />
                  <div className="flex flex-col items-start w-full">
                    <Text message="Email Notifications" size="m14" />

                    {userEmail ? (
                      <button
                        onClick={() => {
                          handleCloseNotifications();
                          setShowEmailModal(true);
                        }}
                        className="w-full flex gap-8"
                      >
                        <Text message={userEmail} size="r14" color="regular" />
                        <Text message="Change" size="r14" color="primary" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleCloseNotifications();
                          setShowEmailModal(true);
                        }}
                      >
                        <Text message="Add email" size="r14" color="primary" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Modal onClose={() => setShowEmailModal(false)} isShow={isShowEmailModal}>
        <AddEmailDialog
          currentMail={userEmail}
          onClose={() => setShowEmailModal(false)}
          onSuccess={() => <></>}
        />
      </Modal>
    </div>
  );
});
