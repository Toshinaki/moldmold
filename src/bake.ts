import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { MOLD_PATH } from './constants';
import { getMolds } from './utils';

type BakeArgsType = {
  mold?: string;
  verbose?: boolean;
};

export const bake = async (argv: BakeArgsType) => {
  let { mold, verbose, ...args } = argv;
  console.log('args: ', args);
  if (!mold) {
    const answerMold = await inquirer.prompt([
      {
        type: 'list',
        name: 'mold',
        message: 'Select a mold to bake with:',
        choices: getMolds(),
      },
    ]);
    mold = answerMold.mold;
  }

  const answerDest = await inquirer.prompt([
    {
      type: 'input',
      name: 'dest',
      message: 'Where to put the baked mold?',
    },
  ]);
  const dest: string = answerDest.dest;

  const moldPath = path.join(MOLD_PATH, mold!);
  let molds = walk(moldPath);
  const keywords = getKeywords(molds);

  let pathReplaces = {};
  let fileReplaces = {};

  if (keywords.path.length > 0) {
    console.log('Enter replacement for mold paths:');
    const answerPathRpl = await inquirer.prompt(
      keywords.path.map((k) => ({
        type: 'input',
        name: k,
        message: `${k}: `,
      })),
    );
    pathReplaces = keywords.path.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: answerPathRpl[curr],
      }),
      {},
    );
  }

  if (keywords.file.length > 0) {
    console.log('Enter replacement for mold files:');
    const answerFileRpl = await inquirer.prompt(
      keywords.file.map((k) => ({
        type: 'input',
        name: k,
        message: `${k}: `,
      })),
    );
    fileReplaces = keywords.path.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: answerFileRpl[curr],
      }),
      {},
    );
  }

  molds.forEach((mold) => {
    let finalPath = path.join(dest, mold.replace(moldPath, ''));
    Object.entries(pathReplaces).forEach(([keyword, replace]) => {
      finalPath = finalPath.replace(new RegExp(keyword), replace as string);
    });
    if (fs.lstatSync(mold).isDirectory()) {
      fs.mkdirSync(finalPath, { recursive: true });
    } else {
      let file = fs.readFileSync(mold).toString();
      Object.entries(fileReplaces).forEach(([keyword, replace]) => {
        // TODO use mustache.js
        file = file.replace(new RegExp(keyword), replace as string);
      });
      fs.mkdirSync(path.dirname(finalPath), { recursive: true });
      fs.writeFileSync(finalPath, file);
    }
  });
};

const walk = (dirPath: string): Array<string> => {
  return fs.readdirSync(dirPath).flatMap((f) => {
    const p = path.join(dirPath, f);
    if (fs.lstatSync(p).isDirectory()) {
      const paths = walk(p);
      if (paths.length === 0) {
        return p;
      } else {
        return paths;
      }
    } else {
      return p;
    }
  });
};

const getKeywords = (paths: Array<string>): { path: Array<string>; file: Array<string> } => {
  // const trimKeywords = (k: string) => k.replace(/[{}]/gm, '').trim();

  let pathKeywords: Array<string> = [];
  let fileKeywords: Array<string> = [];

  paths.forEach((p) => {
    // path
    pathKeywords = pathKeywords.concat(p.match(/{{.+?}}/gm) || []);

    // file
    if (fs.lstatSync(p).isFile()) {
      const file = fs.readFileSync(p).toString();
      fileKeywords = fileKeywords.concat(file.match(/{{.+?}}/gm) || []);
    }
  });
  return {
    // path: pathKeywords.map(trimKeywords),
    // file: fileKeywords.map(trimKeywords),
    path: pathKeywords,
    file: fileKeywords,
  };
};
