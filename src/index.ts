#!/usr/bin/env node

// import yargs, { Options } from 'yargs';
// import { hideBin } from 'yargs/helpers';
// import { bake } from './bake';
// import { addMoldMold } from './mold';

import { Command } from 'commander';
import { clear } from 'console';

import mold from './mold';
import bake from './bake';
import checkConfig from './checkConfig';
// import { duplicationCheck } from './utils';

clear();

void (async () => {
  if (await checkConfig()) {
    const program = new Command();

    program.name('moldmold').version(require('../package.json').version).description('Create molds or bake from one');

    program
      .command('mold')
      .description('Create a new mold')
      .argument('[name]', "the mold's name")
      // .option('-s, --source', 'create mold from an existing one')
      // .option('-m, --modify', 'modify an existing mold')
      .action(mold);

    program
      .command('bake')
      .description('Bake with the given mold')
      .argument('[mold]', 'name of the mold to bake with')
      // .option('-f, --file', 'path to the file that contains key-value pairs as replacements')
      // .option('-r, --replaces', '"key=value" pairs separated by ",", as the replacements')
      // .option('-g, --generate', 'generate a json file that contains all keys to be replaced')
      .action(bake);

    program.parse();
  }
})();
