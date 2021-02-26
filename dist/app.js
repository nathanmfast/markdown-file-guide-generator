"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
const markdown = generator_1.generate('C:\\Projects\\markdown-file-guide-generator', ['node_modules', 'dist', '.git']);
console.log(markdown);
// this is how command line arguments work when using minimist
console.log('--minimist--');
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
console.log(argv.test);
// try running 'npm run build' then 'node ./app.js --test=derp' to see it in action
//# sourceMappingURL=app.js.map