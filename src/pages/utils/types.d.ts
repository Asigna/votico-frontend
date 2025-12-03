export type Asset = {
  metadata: {
    tx_id: string;
  };
  type: 'BRC_20' | 'INSCRIPTION_COLLECTION' | 'RUNE';
  assetId: string;
};

export type Strategy = {
  strategy: 'WEIGHTED' | 'WHITELIST' | 'TICKET' | 'QUORUM' | 'BITCREDIT';
  weight: number;
  asset?: Asset;
  whitelist?: string[];
};

export type User = {
  _id?: string;
  name: string;
  image: string;
  address: string;
  type: string;
};

export type Role = 'admin' | 'author' | 'voter' | 'member';

export type Project = {
  _id: string;
  avatar: string;
  name: string;
  membersCount: number;
  isMember: boolean;
  about: string;
  website?: string;
  termsLink?: string;
  isHidden?: boolean;
  adminList?: User[];
  memberList?: User[];
  team?: User[];
  strategies?: Strategy[];
  tags: string[];
  role: Role;
  roles: Role[];
  socials?: {
    twitter: string;
    github: string;
    coingecko: string;
    telegram: string;
    discord: string;
  };
  quorum?: boolean;
  quorumThreshold?: string;
  quorumReached?: string;
  type?: string;
};

export type VoteSummary = {
  votingPower: string;
  proportion: string;
};

export type VoteVariant = {
  totalVotingPower: string;
  quorumReached?: string;
  voteSummary: Record<string, VoteSummary>;
};

export type Voter = {
  name: string;
  image: string;
  userAddress: string;
  answers: { key: string; votingPower: string; value?: number }[];
};

export interface IProposalMilestone {
  deadline: string;
  deliverable: string;
  rewardAmount: string;
}

const ProposalTypeLabels = {
  // common: 'None',
  contribution_proposal: 'Contribution proposal',
  delivery_acceptance: 'Delivery acceptance',
  strategic_decision: 'Strategic decision',
} as const;

export type ProposalType = keyof typeof ProposalTypeLabels;

export type Proposal = {
  _id: string;
  assets?: Asset[];
  ipfs: string;
  projectId: string;
  votingType: 'single' | 'weighted' | 'approval' | 'basic'; // | 'ranked'
  title: string;
  text: string;
  block?: string;
  startDate: number;
  endDate: number;
  votingResult?: VoteVariant;
  options?: string[];
  discussion?: string;
  userVote: {
    answers: {
      key: string;
      value?: number;
    }[];
  } | null;
  voterList: Voter[];
  isBlockReleased: boolean;
  ipfsGatewayToken: string;
  ipfsHash: string;
  ipfsUrl: string;
  quorumThreshold?: string;
  quorumReached?: string;

  proposalType?: ProposalType;
  links?: {
    type: 'proposal' | 'github_discussion';
    link: string;
  }[];
  nextMilestone?: IProposalMilestone;
  roadmap?: string;
  rewardRecipient?: string;
  retryCount?: number;
  bitcreditHoldersCount?: number;
};
