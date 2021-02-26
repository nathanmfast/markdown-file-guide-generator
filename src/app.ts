import * as minimist from 'minimist'
import { generate } from './generator'

var args = minimist(process.argv.slice(2));
const markdown = generate(args.rootFolderPath ?? './', args.folderNamesToIgnoreFilesIn ?? [], args.column1Heading, args.column2Heading);
console.log(markdown)

//['node_modules', 'dist', '.git']

// try running 'npm run build' then 'node ./app.js --column1Heading=Derp' to see it in action
// alternatively: 
// node ./app.js --column1Heading=Derp --rootFolderPath="C:\X\Scripts\regedit" --folderNamesToIgnoreFilesIn="['regedit']"