export type MoldType = {
  path: string;
  type: 'file' | 'folder';
};

// type FileMoldType = MoldType & {
//   type: 'file';
// };
// type FolderMoldType = MoldType & {
//   type: 'folder';
// };

type MoldMoldType = {
  name: string;
  keywords: Array<string>;
};

export type ConfigType = {
  mold_dir: string;
  author?: string;
  molds: Array<MoldMoldType>;
};
