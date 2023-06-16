import $api from '@/plugins/api';
import {
  DocumentFolder,
  CreateFolderPayload,
  CreateFilePayload,
  DocumentFile,
  SearchedReponse,
  BulkDocument,
} from '@/types/documents.type';

export function useDocuments() {
  const getFolders = async ({
    id,
    folderId,
    isPortal,
  }: {
    id: string;
    folderId?: string;
    isPortal?: boolean;
  }) => {
    const url = folderId
      ? `${
          isPortal
            ? `portal/clients/folders/${folderId}`
            : `clients/${id}/folders/${folderId}`
        }`
      : `${isPortal ? `portal/clients/folders` : `clients/${id}/folders`}`;
    const { data } = await $api.get<DocumentFolder | DocumentFolder[]>(url);
    return data;
  };

  const getFolder = async ({
    id,
    folderId,
    isPortal,
  }: {
    id: string;
    folderId: string;
    isPortal?: boolean;
  }) => {
    const { data } = await $api.get<DocumentFolder>(
      `${
        isPortal
          ? `portal/clients/folders/${folderId}`
          : `clients/${id}/folders/${folderId}`
      }`
    );
    return data;
  };

  const createFolder = async (
    id: string,
    payload: CreateFolderPayload,
    isPortal?: boolean
  ) => {
    const { data } = await $api.post<DocumentFolder>(
      `${isPortal ? `portal/clients/folders` : `clients/${id}/folders`}`,
      payload
    );
    return data;
  };

  const updateFolder = async ({
    id,
    folderId,
    payload,
    isPortal,
  }: {
    id: string;
    folderId: string;
    payload: CreateFolderPayload;
    isPortal?: boolean;
  }) => {
    const { data } = await $api.patch<DocumentFolder>(
      `${
        isPortal
          ? `portal/clients/folders/${folderId}`
          : `clients/${id}/folders/${folderId}`
      }`,
      payload
    );
    return data;
  };

  const deleteFolder = async (
    id: string,
    folderId: string,
    isPortal?: boolean
  ) => {
    const { data } = await $api.delete<DocumentFolder>(
      `${
        isPortal
          ? `portal/clients/folders/${folderId}`
          : `clients/${id}/folders/${folderId}`
      }`
    );
    return data;
  };

  const getFiles = async ({
    id,
    folderId,
    isPortal,
  }: {
    id: string;
    folderId?: string;
    isPortal?: boolean;
  }) => {
    const { data } = await $api.get<DocumentFile[]>(
      `${isPortal ? `portal/clients/files?` : `clients/${id}/files?`}${
        folderId ? `folderId=${folderId}` : ''
      }`
    );
    return data;
  };

  const getFile = async (id: string, fileId: string, isPortal?: boolean) => {
    const { data } = await $api.get<DocumentFile>(
      `${isPortal ? `portal/clients/files/` : `clients/${id}/files/`}${fileId}`
    );
    return data;
  };

  const createFile = async (
    id: string,
    payload: CreateFilePayload,
    folderId?: string,
    isPortal?: boolean
  ) => {
    const { data } = await $api.post<DocumentFile>(
      `${isPortal ? `portal/clients/files?` : `clients/${id}/files?`}${
        folderId ? `${folderId}` : ''
      }`,
      payload
    );
    return data;
  };

  const updateFile = async ({
    id,
    payload,
    folderId,
    fileId,
    isPortal,
  }: {
    id: string;
    fileId: string;
    payload: Partial<CreateFilePayload>;
    folderId?: string;
    isPortal?: boolean;
  }) => {
    const { data } = await $api.patch<DocumentFile>(
      `${isPortal ? `portal/clients/files/` : `clients/${id}/files/`}${fileId}${
        folderId ? `/${folderId}` : ''
      }`,
      payload
    );
    return data;
  };

  const deleteFile = async (id: string, fileId: string, isPortal?: boolean) => {
    const { data } = await $api.delete<DocumentFile>(
      `${isPortal ? `portal/clients/files/` : `clients/${id}/files/`}${fileId}`
    );
    return data;
  };

  const searchFilesAndFolders = async ({
    id,
    folderId,
    mode,
    q,
    isPortal,
  }: {
    id: string;
    folderId?: string;
    mode: 'all' | 'folder' | 'file';
    q: string;
    isPortal?: boolean;
  }) => {
    const { data } = await $api.get<SearchedReponse>(
      `${isPortal ? `portal/clients/search` : `clients/${id}/search`}`,
      {
        params: {
          mode,
          folderId,
          q,
        },
      }
    );
    return data;
  };

  const downloadFolder = async (
    id: string,
    folder: DocumentFolder,
    isPortal?: boolean
  ) => {
    const { data } = await $api.post(
      `${isPortal ? `portal/clients/downloads` : `clients/${id}/downloads`}`,
      {
        uIds: [folder.id],
        name: 'download',
      }
    );
    return data;
  };

  const bulkUpdateDocuments = async (
    id: string,
    payload: BulkDocument,
    isPortal?: boolean
  ) => {
    const { data } = await $api.patch<void>(
      `${
        isPortal
          ? `portal/clients/files/bulk-update`
          : `clients/${id}/files/bulk-update`
      }`,
      payload
    );
    return data;
  };

  return {
    createFolder,
    getFolders,
    getFolder,
    updateFolder,
    deleteFolder,
    createFile,
    getFiles,
    getFile,
    updateFile,
    deleteFile,
    downloadFolder,
    searchFilesAndFolders,
    bulkUpdateDocuments,
  };
}
