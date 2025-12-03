export const messages = {
  strategies: {
    WEIGHTED: 'Token weighted',
    WHITELIST: 'Whitelist',
    TICKET: 'Ticket',
    QUORUM: 'Quorum',
    BITCREDIT: 'BITCREDIT',
  },
  standard: {
    BRC_20: 'BRC-20',
    INSCRIPTION_COLLECTION: 'ORDINAL',
    RUNE: 'RUNE',
  },
  assetName: {
    BRC_20: 'Token Ticker',
    INSCRIPTION_COLLECTION: 'Ordinals collection',
    RUNE: 'Runes name',
  },
  votingType: {
    single: 'Single choice',
    weighted: 'Weighted',
    approval: 'Approval',
    basic: 'Basic',
  },
  votingTypeDescription: {
    single: 'Each user can select only one option from many, giving it his total voting power.',
    weighted:
      'Each user can spread their voting power across any number of choices, from one to all.',
    approval:
      'Each user can select any number of choices, each selected choice will receive equal voting power.',
    basic:
      'Each user can select one of three options: For, Against, Abstain. These choices are predefined and cannot be edited.',
  },
};
