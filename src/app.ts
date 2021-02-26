import * as minimist from 'minimist'
import { generate } from './generator'

var opts = {
  string: ['rootFolderPath', 'column1Heading', 'column2Heading'],
  default: { rootFolderPath: './' },
  alias: { path: 'rootFolderPath' }
}
var args = minimist(process.argv.slice(2), opts)
const markdown = generate(args.rootFolderPath, args._ ?? [], args.column1Heading, args.column2Heading)
console.log(markdown)

// try running 'npm run build' then from project root run:
// node ./dist/app.js --column1Heading=Test1 --column2Heading=Test2 node_modules dist .git

// To create executable, use 'pkg'
// First, install 'pkg' globally using 'npm install -g pkg'
// Then, change to the 'dist' directory, the run 'pkg app.js' and it will generate executables for linux, mac, and windows