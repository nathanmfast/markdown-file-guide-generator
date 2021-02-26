import { generate } from './generator'
import * as minimist from 'minimist'

const markdown = generate('C:\\Projects\\markdown-file-guide-generator', ['node_modules', 'dist', '.git'])
console.log(markdown)

// this is how command line arguments work when using minimist
console.log('--minimist--');
var args = minimist(process.argv.slice(2));
console.log(args.test);

// try running 'npm run build' then 'node ./app.js --test=derp' to see it in action