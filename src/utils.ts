import fs from 'fs';
import { CONFIG_FILE_NAME } from './constants';
import { ConfigType } from './types';

export const duplicationCheck = (name: string): boolean => {
  const raw = fs.readFileSync(CONFIG_FILE_NAME);
  const config: ConfigType = JSON.parse(raw.toString());

  if (!config.molds || config.molds.length === 0) {
    return true;
  } else {
    return config.molds.findIndex((mold) => mold.name === name) > -1;
  }
};

export const updateMolds = (name: string) => {
  const raw = fs.readFileSync(CONFIG_FILE_NAME);
  const config: ConfigType = JSON.parse(raw.toString());

  config.molds = [...(config.molds || []), { name, keywords: [] }];

  fs.writeFileSync(CONFIG_FILE_NAME, JSON.stringify(config, null, 2));
};

export const getMolds = () => {
  const raw = fs.readFileSync(CONFIG_FILE_NAME);
  const config: ConfigType = JSON.parse(raw.toString());

  return config.molds;
};
