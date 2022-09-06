import fs from 'fs';
import inquirer from 'inquirer';

import { CONFIG_FILE_NAME, DEFAULT_CONFIG } from './constants';

const init = async () => {
  console.log(
    'Looks like this is your first time using moldmold in this project.\nPlease follow the instructions to set up.\n',
  );
  return await inquirer.prompt([
    {
      name: 'author',
      type: 'input',
      message: 'Your name, as author of your custom molds: ',
    },
    {
      name: 'mold_dir',
      type: 'input',
      message: 'Where to save your custom molds?',
      default: '__molds__',
    },
  ]);
};

const checkConfig = async () => {
  if (!fs.existsSync(CONFIG_FILE_NAME)) {
    const custom = await init();
    const config = { ...DEFAULT_CONFIG, ...custom };

    fs.writeFileSync(CONFIG_FILE_NAME, JSON.stringify(config, null, 2));
    fs.mkdirSync(config.mold_dir);
    return false;
  }
  return true;
};

export default checkConfig;
