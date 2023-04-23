import { useCallback, useContext } from 'react';

import useStorageService from '@/services/useStorageService';

import { Conversation } from '@/types/chat';
import { FolderInterface, FolderType } from '@/types/folder';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/pages/api/home/home.context';

import { v4 as uuidv4 } from 'uuid';

type FoldersAction = {
  update: (newState: FolderInterface) => Promise<FolderInterface[]>;
  updateAll: (newState: FolderInterface[]) => Promise<FolderInterface[]>;
  add: (name: string, type: FolderType) => Promise<FolderInterface[]>;
  remove: (folderId: string) => Promise<FolderInterface[]>;
  clear: () => Promise<FolderInterface[]>;
};

export default function useFolders(): [FolderInterface[], FoldersAction] {
  const storageService = useStorageService();
  const {
    state: { folders, conversations, prompts },
    dispatch,
  } = useContext(HomeContext);

  const updateAll = useCallback(
    async (updated: FolderInterface[]): Promise<FolderInterface[]> => {
      await storageService.saveFolders(updated);
      dispatch({ field: 'folders', value: updated });
      return updated;
    },
    [dispatch, storageService],
  );

  const add = useCallback(
    async (name: string, type: FolderType) => {
      const newFolder: FolderInterface = {
        id: uuidv4(),
        name,
        type,
      };
      const newState = [...folders, newFolder];
      return updateAll(newState);
    },
    [folders, updateAll],
  );

  const update = useCallback(
    async (folder: FolderInterface) => {
      const newState = folders.map((f) => {
        if (f.id === folder.id) {
          return folder;
        }
        return f;
      });
      return updateAll(newState);
    },
    [folders, updateAll],
  );

  const clear = useCallback(async () => {
    const newState = folders.filter((f) => f.type !== 'chat');
    return updateAll(newState);
  }, [folders, updateAll]);

  const remove = useCallback(
    async (folderId: string) => {
      const newState = folders.filter((f) => f.id !== folderId);
      await updateAll(newState);

      const updatedConversations: Conversation[] = conversations.map((c) => {
        if (c.folderId === folderId) {
          return {
            ...c,
            folderId: null,
          };
        }
        return c;
      });
      await storageService.saveConversations(updatedConversations);
      dispatch({ field: 'conversations', value: updatedConversations });

      const updatedPrompts: Prompt[] = prompts.map((p) => {
        if (p.folderId === folderId) {
          return {
            ...p,
            folderId: null,
          };
        }

        return p;
      });

      await storageService.savePrompts(updatedPrompts);
      dispatch({ field: 'prompts', value: updatedPrompts });
      return newState;
    },
    [conversations, dispatch, folders, prompts, storageService, updateAll],
  );

  return [
    folders,
    {
      add,
      update,
      updateAll,
      remove,
      clear,
    },
  ];
}
