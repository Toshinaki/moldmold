import { ConfigType } from './types';

export const CONFIG_FILE_NAME = 'moldmold.config.json';
export const MOLD_PATH = '__molds__';

export const DEFAULT_CONFIG: ConfigType = {
  mold_dir: MOLD_PATH,
  molds: [],
};
