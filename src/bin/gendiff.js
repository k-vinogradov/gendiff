#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

const app = (firstConfigFile, secondConfigFile, { format }) => {
  console.log(genDiff(firstConfigFile, secondConfigFile, format));
};

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.7.3')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format', 'structured')
  .action(app)
  .parse(process.argv);
