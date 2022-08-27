import inquirer from 'inquirer';

type BakeArgsType = {
  mold?: string;
  verbose?: boolean;
};

const bake = async (argv: BakeArgsType) => {
  let { mold, verbose, ...args } = argv;

  if (!mold) {
    const answers = await inquirer.prompt([
      {
        name: 'mold',
        message: 'Enter the mold name',
        type: 'input',
        suffix: '',
        validate: (input) => (input as string).length > 0,
      },
    ]);
    mold = answers.mold;
  }
  if (verbose) {
    console.info(`[*] baking with mold :${mold}`);
  }
};

export default bake;
