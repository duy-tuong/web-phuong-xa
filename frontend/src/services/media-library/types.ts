export type PublicMediaResponse = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Array<{
    id: number;
    fileName: string;
    filePath: string;
    type: string;
    fileType?: string | null;
    fileSize?: number | null;
    uploadedAt: string;
  }>;
};

export type MediaTheme = {
  title: string;
  description: string;
};

export type PaginatedLibraryResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type LibraryPhotoItem = {
  id: string;
  title: string;
  desc: string;
  image: string;
  theme: string;
};

export type LibraryVideoItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  sourceUrl: string;
};
