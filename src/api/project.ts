import { voticoAxiosInstance } from './instance.ts';
import { ProjectListDto } from './types';

export const getProjectById = async (projectId: string) => {
  return voticoAxiosInstance.get(`/projects/${projectId}`);
};

export const getProjects = async (payload?: ProjectListDto) => {
  return voticoAxiosInstance.post('/projects', payload);
};

export const getMyProjects = async () => {
  try {
    return voticoAxiosInstance.get('/projects/my');
  } catch (error) {
    console.error(error);
  }
};

export interface AssetType {}
export interface IVotingPower {
  assetName?: string;
  assetType?: AssetType;
  elementId?: string;
  // strategyValue: number;
  // votingPower: number;
  // delegatedVotingPower?: number;
  // assetsAmount: IAssetVotingPower[];

  _id: string;
  proposalId: string;
  userId: string;
  block: number;
  currentVotingPower: number;
  isOnDemandProcessed: boolean;
  isPlannedProcessed: boolean;
  totalVotingPower: number;
  userAddress: string;
  votingPowerType: string;
  id: string;
}

export const joinToProject = async (projectId: string) => {
  return voticoAxiosInstance.get(`/projects/${projectId}/join`);
};

export const leaveFromTheProject = async (projectId: string) => {
  return voticoAxiosInstance.delete(`/projects/${projectId}/join`);
};
