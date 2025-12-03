import { Project } from '@/pages/utils/types';

export const calcSocialsLength = (project: Project): number => {
  if (!project.socials) {
    return 0;
  }

  const { socials } = project;

  const existingSocials = Object.values(socials).filter((socialLink) => Boolean(socialLink));

  return existingSocials.length;
};
