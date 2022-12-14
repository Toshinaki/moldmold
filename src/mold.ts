import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { MoldType } from './types';
import { MOLD_PATH } from './constants';
import { updateMolds } from './utils';

const addMold = async () =>
  inquirer.prompt<{ type: 'file' | 'folder'; path: string; repeat: boolean }>([
    {
      name: 'type',
      type: 'list',
      message: 'Do you want to add a file or a folder?',
      choices: ['file', 'folder'],
    },
    {
      name: 'path',
      type: 'input',
      message: (answers) =>
        `Enter a relative path for the ${answers.type}: (use the curly  brackets to make it replaceable)`,
    },
    {
      type: 'confirm',
      name: 'repeat',
      message: 'Want to add another (just hit ENTER for YES)?',
      default: true,
    },
  ]);

export const getMoldMoldName = async (): Promise<string> => {
  const answers = await inquirer.prompt<{ name: string }>([
    { name: 'name', type: 'input', message: 'What do you want to call this moldmold?' },
  ]);
  return answers.name;
};

export const addMoldMold = async (name?: string) => {
  if (!name) {
    name = await getMoldMoldName();
  }

  const moldPath = path.join(MOLD_PATH, name);

  let molds: Array<MoldType> = [];

  while (true) {
    if (molds.length > 0) {
      console.log('Current molds:');
      molds.sort((a, b) => a.path.localeCompare(b.path)).forEach((m) => console.log(`${m.path} - ${m.type}`));
    }
    const mold = await addMold();
    molds.push({ type: mold.type, path: mold.path });

    molds = molds.filter((v, i, a) => a.indexOf(v) === i); // unique

    if (!mold.repeat) {
      break;
    }
  }

  console.log('Creating molds...');

  molds.forEach((mold) => {
    const p = path.join(moldPath, mold.path);
    if (mold.type === 'file') {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, '');
    } else {
      fs.mkdirSync(p, { recursive: true });
    }
  });

  console.log(`Done adding ${molds.length} mold(s)!`);

  updateMolds(name);
};
