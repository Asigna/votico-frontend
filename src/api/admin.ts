import { Strategy, User } from '@/pages/utils/types';
import { MemberResponse } from '@types';
import { voticoAxiosInstance } from '@api/instance.ts';

export type ProjectInfo = {
  _id: string;
  name: string;
  about: string;
  tags: string[];
  website: string;
  termsLink: string;
  isHidden: boolean;
  socials?: {
    twitter: string;
    github: string;
    coingecko: string;
    telegram: string;
    discord: string;
  };
};
export const changeProjectInfo = async (project: ProjectInfo) => {
  const { _id, ...payload } = project;

  return voticoAxiosInstance.post(`projects/${_id}/options`, payload);
};

export interface ProposalType {}
export interface ProposalLinkType {}

export interface IProposalLink {
  link: string;
  type: ProposalLinkType;
}

export interface IProposalMilestone {
  deadline: string;
  deliverable: string;
  rewardAmount?: string;
}

export type NewProposal = {
  title: string;
  projectId: string;
  text: string;
  block: number;
  startDate: number;
  endDate: number;
  votingType: 'single' | 'weighted' | 'approval' | 'basic'; //  | 'ranked'
  discussion?: string;
  options: string[];
  isHiddenVotes: boolean;

  proposalType?: ProposalType;
  links?: IProposalLink[];
  nextMilestone?: IProposalMilestone;
  roadmap?: string;
  rewardRecipient?: string;
};

export type ProposalSettingsData = {
  minPower: number;
  isEnableGuest: boolean;
};

export const createProposal = async (proposal: NewProposal) => {
  return voticoAxiosInstance.post(`proposals`, proposal);
};

export const newMember = async (projectId: string, member: User) => {
  return voticoAxiosInstance.post<MemberResponse>(
    `projects/${projectId}/invite/${member.address}`,
    {
      role: member.type?.toLowerCase(),
    }
  );
};

export const changeMemberRole = async (projectId: string, userId: string, role: string) =>
  voticoAxiosInstance.post(`projects/${projectId}/members`, { userId, role });

export const deleteMember = async (projectId: string, userId: string) =>
  voticoAxiosInstance.delete(`projects/${projectId}/members/${userId}`);

export const changeProjectStrategies = async (_id: string, strategies: Strategy[]) => {
  return voticoAxiosInstance.post(`projects/${_id}/options/strategies`, { strategies });
};

export const insertProjectStrategies = async (_id: string, quorumThreshold: number) => {
  return voticoAxiosInstance.post(`projects/${_id}/options/quorum`, { quorumThreshold });
};

export const deleteProjectQuorum = async (_id: string) => {
  return voticoAxiosInstance.delete(`projects/${_id}/options/quorum`);
};
