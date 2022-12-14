#!/usr/bin/env node

import yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { bake } from './bake';

import checkConfig from './checkConfig';
import { addMoldMold } from './mold';
import { duplicationCheck } from './utils';

// clear();

void (async () => {
  if (await checkConfig()) {
    const OPTS: Record<string, Options> = {
      l: {
        alias: 'list',
        type: 'boolean',
        describe: 'Show available local molds',
      },
      L: {
        alias: 'list-remote',
        type: 'boolean',
        describe: 'Show available remote molds',
      },
      v: {
        alias: 'verbose',
        type: 'boolean',
        description: 'Run in verbose mode',
      },
    };
    const ALIASES = {
      V: 'version',
      h: 'help',
    };

    void yargs(hideBin(process.argv))
      .scriptName('mold')
      .usage('Usage: $0 <cmd> [args]')
      .strictCommands()
      .command(
        'mold [name]',
        'Create a new mold',
        (y) => {
          return y.positional('name', {
            type: 'string',
            describe: 'the name of the mold to be created',
          });
        },
        (argv) => {
          if (argv.name && duplicationCheck(argv.name)) {
            throw new Error(`A mold with name "${argv.name}" already exists. Try with another name.`);
          }
          void addMoldMold(argv.name);
        },
      )
      .command(
        'bake [mold]',
        'Bake with given mold',
        (y) =>
          y.positional('mold', {
            type: 'string',
            describe: 'the name of the mold to bake with',
          }),
        (argv) => bake(argv),
      )
      .options(OPTS)
      .help()
      .alias(ALIASES)
      .parse();
  }
})();
