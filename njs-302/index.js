#!/usr/bin/env node
const program = require('commander')

program
  .version('1000')
  .option('-l, --lucas', 'Lucas le boss')


program.parse(process.argv)

if(program.lucas) {
  console.log('Coucou Lucas');
} else {
  program.help()
}
