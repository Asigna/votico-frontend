import React from 'react';

import { Button, Text, Image } from '@kit';
import external from '@images/external.svg';
import discordIcon from '@images/logo/discord.png';
import displayIcon from '@images/display.svg';
import dashedTop from '@images/dashed-top.svg';
import dashedBottom from '@images/dashed-bottom.svg';
import urls from '@constants/urls';

export const AddProjectModal: React.FC = React.memo(() => {
  return (
    <div className="rounded-[12rem] p-16 sm:p-24 relative bg-[#18191B] border-[.5px] border-white-10 mx-16 sm:mx-0">
      <Text message="Create project" size="s22" />
      <div className="flex justify-center items-center gap-24 relative py-[20rem] mt-[34rem]">
        <Image src={dashedTop} size={{ w: 106, h: 53 }} className="absolute top-0" />
        <Image src={dashedBottom} size={{ w: 106, h: 53 }} className="absolute bottom-0" />
        <div className="flex justify-center items-center w-[72rem] h-[72rem] border-[.5px] rounded-[36rem] border-white-10 bg-[#1F2022]">
          <Image size={30} src={displayIcon} />
        </div>
        <div className="flex justify-center items-center w-[72rem] h-[72rem] border-[.5px] rounded-[36rem] border-white-10 bg-[#5462eb]">
          <Image size={30} src={discordIcon} />
        </div>
      </div>
      <Text
        message="It is a beta version of Votico."
        size="s16"
        className="text-center mt-[18rem] relative"
      />
      <Text
        message="To create a project leave a request via Discord"
        size="s16"
        className="text-center relative px-16"
      />
      <Button
        message="Open Discord"
        size="md"
        className="mx-auto mt-48 w-full"
        rightIcon={external}
        colorIcon="white"
        onClick={() => window.open(urls.DISCORD, '_blank')}
      />
    </div>
  );
});
