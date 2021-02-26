import { generate } from './generator'

const markdown = generate('C:\\Projects\\markdown-file-guide-generator', ['node_modules', 'dist', '.git'])
console.log(markdown)

// this is how command line arguments work when using minimist
console.log('--minimist--');
var argv = require('minimist')(process.argv.slice(2));
//console.log(argv);
console.log(argv.test);

// try running 'npm run build' then 'node ./app.js --test=derp' to see it in action