import * as minimist from 'minimist'
import { generate } from './generator'

var args = minimist(process.argv.slice(2));
const markdown = generate('./', ['node_modules', 'dist', '.git'], args.column1Heading, args.column2Heading);
console.log(markdown)

// try running 'npm run build' then 'node ./app.js --column1Heading=Derp' to see it in action