import React, { startTransition, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { Button, Image, Text } from '@kit';
import { Project } from '@pages/utils/types';
import { formatNumberToShortString } from '@utils';
import { useAddress } from '@store';
import { joinToProject, leaveFromTheProject } from '@api/project.ts';
import { Avatar, JoinedButton } from '@components';
import checkIcon from '@images/check.svg';
import settingsIcon from '@images/settings.svg';
import world from '@images/world.svg';
import paths from '@constants/paths.ts';
import github from '@images/github.svg';
import twitter from '@images/x.png';
import telegram from '@images/telegram.svg';
import discord from '@images/discord.svg';
import coingecko from '@images/coingecko.svg';

import { calcSocialsLength } from './utils';

type ProjectInfoProps = {
  project: Project;
  onClickButton: (id: string, status: boolean) => void;
};

export const ProjectInfo: React.FC<ProjectInfoProps> = React.memo((props) => {
  const { project, onClickButton } = props;
  const navigate = useNavigate();

  const shortCount = formatNumberToShortString(project.membersCount);
  const handleNavigation = () => {
    startTransition(() => {
      navigate(`/${paths.PROFILE}/${project._id}`);
    });
  };

  const { address } = useAddress();
  const { onLogin } = useOutletContext<{ onLogin: () => void }>();

  const handleClickButton = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      if (!address) {
        onLogin();
        return;
      }

      const result: { data: { success: boolean } } = project.isMember
        ? await leaveFromTheProject(project._id)
        : await joinToProject(project._id);

      if (result.data.success) {
        onClickButton(project._id, !project.isMember);
      }
    },
    [address, onClickButton, onLogin, project._id, project.isMember]
  );

  const socialsLength = calcSocialsLength(project);

  const isBitcredit = project.type === 'bitcredit';

  return (
    <div className="bg-white-3 p-16 sm:p-24 rounded-[12rem] border-[.5px] border-white-10 flex flex-col gap-16">
      <div className="flex gap-12">
        <div className="min-w-[48rem]">
          <Avatar uniqueString={project._id} size={48} src={project.avatar} />
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:justify-between gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-8">
              <Text size="s18" sizeSm="m16" font="titillium" message={project.name} />
              {(Boolean(project.website) || socialsLength > 0) && (
                <>
                  <div className="bg-regular w-[2rem] h-[2rem] rounded-[2rem]" />
                  <div className="flex items-center gap-12">
                    {socialsLength > 0 && (
                      <>
                        {Boolean(project.socials?.github) && (
                          <a
                            href={project.socials?.github}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Image src={github} size={16} color="white" />
                          </a>
                        )}
                        {Boolean(project.socials?.twitter) && (
                          <a
                            href={project.socials?.twitter}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Image src={twitter} size={16} color="white" />
                          </a>
                        )}
                        {Boolean(project.socials?.telegram) && (
                          <a
                            href={project.socials?.telegram}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Image src={telegram} size={16} color="white" />
                          </a>
                        )}
                        {Boolean(project.socials?.coingecko) && (
                          <a
                            href={project.socials?.coingecko}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Image src={coingecko} size={16} />
                          </a>
                        )}
                        {Boolean(project.socials?.discord) && (
                          <a
                            href={project.socials?.discord}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Image src={discord} size={16} color="white" />
                          </a>
                        )}
                      </>
                    )}
                    {Boolean(project.website) && (
                      <a href={project.website} target="_blank" className="flex items-center">
                        <Image src={world} size={16} color="white" />
                      </a>
                    )}
                    {isBitcredit && <></>}
                  </div>
                </>
              )}
            </div>
            <Text
              size="r14"
              sizeSm="r13"
              message={
                project.membersCount === 1 ? `${shortCount} member` : `${shortCount} members`
              }
            />
          </div>
          <div className="flex gap-8">
            <Button
              className="w-full sm:w-auto sm:min-w-[118rem] hidden sm:flex"
              message={project.isMember ? 'Joined' : 'Join'}
              hoverMessage={project.isMember ? 'Leave' : undefined}
              colorType={project.isMember ? 'inherit' : 'primary'}
              rightIcon={project.isMember ? checkIcon : null}
              size="sm"
              onClick={handleClickButton}
            />
            <div className="w-full sm:hidden">
              <JoinedButton
                message={project.isMember ? 'Joined' : 'Join'}
                colorType={project.isMember ? 'inherit' : 'primary'}
                onClick={handleClickButton}
              />
            </div>
            {project.roles?.includes('admin') && (
              <button
                onClick={handleNavigation}
                className="bg-white-3 hover:bg-white-5 border-[.5px] border-white-10 rounded-[8rem] flex items-center justify-center h-[40rem] w-[40rem] min-w-[40rem]"
              >
                <Image src={settingsIcon} size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      {project.tags?.length > 0 && (
        <>
          <div className="bg-white-10 w-full h-[1px]" />
          <div className="flex gap-8 items-center w-full wrap">
            {project.tags.map((tag) => (
              <Text
                size="r14"
                message={tag}
                className="flex items-center justify-center bg-white-5 border-white-10 border-[1rem] rounded-[4rem] h-[28rem] px-16 py-2"
                key={tag}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
