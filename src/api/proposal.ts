import { voticoAxiosInstance } from './instance.ts';

export type SearchProposalInfo = {
  name: string;
  status: string;
};

export const getProposalListByProjectId = async (
  projectId: string,
  payload: { page: number; limit: number; name?: string; status?: string }
) => {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(payload)
        .filter(([, value]) => !!value)
        .map(([key, value]) => [key, value.toString()])
    )
  );
  return voticoAxiosInstance.get(`/projects/${projectId}/proposals?${params}`);
};

export const getProposalList = async (payload: {
  page: number;
  limit: number;
  name?: string;
  status?: string;
}) => {
  const tmpPayload = {
    page: payload.page,
    limit: payload.limit,
    ...(payload.name && { name: payload.name }),
    ...(payload.status && { status: payload.status }),
  };

  return voticoAxiosInstance.post(`/proposals/feed`, tmpPayload);
};

export const getProposalById = async (proposalId: string) => {
  return voticoAxiosInstance.get(`/proposals/${proposalId}`);
};
export const getProposalVotesById = async (proposalId: string) => {
  return voticoAxiosInstance.get(`/proposals/${proposalId}/votes`);
};

export const getProposalSummaryById = async (proposalId: string) => {
  return voticoAxiosInstance.get(`/proposals/${proposalId}/summary`);
};

export const getVotingPower = async (proposalId: string) => {
  return voticoAxiosInstance.get(`/proposals/${proposalId}/power`);
};

export const castVote = async (payload: {
  proposalId: string;
  answers: { key: string; value?: number }[];
}) => {
  const { proposalId, answers } = payload;
  return voticoAxiosInstance.post(`/proposals/${proposalId}/vote`, { answers });
};

export const deleteProposal = async (id: string) => voticoAxiosInstance.delete('/proposals/' + id);

export const getProposalCurrentPower = async (
  proposalId: string,
  page: number = 0,
  limit: number = 10
) => {
  return voticoAxiosInstance.get(
    `/proposals/${proposalId}/current-power?page=${page}&limit=${limit}`
  );
};

export const getProposalHistoryPower = async (
  proposalId: string,
  page: number = 0,
  limit: number = 100
) => {
  return voticoAxiosInstance.get(
    `/proposals/${proposalId}/history-power?page=${page}&limit=${limit}`
  );
};
