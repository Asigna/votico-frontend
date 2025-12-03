import { atom, useAtom } from 'jotai';

import { IContact } from '@types';

const contactsAtom = atom<IContact[]>([]);

export const useContacts = () => {
  const [contacts, setContacts] = useAtom(contactsAtom);

  return {
    contacts,
    setContacts,
  };
};
