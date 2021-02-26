"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
const minimist = require("minimist");
const markdown = generator_1.generate('C:\\Projects\\markdown-file-guide-generator', ['node_modules', 'dist', '.git']);
console.log(markdown);
// this is how command line arguments work when using minimist
console.log('--minimist--');
var args = minimist(process.argv.slice(2));
console.log(args.test);
// try running 'npm run build' then 'node ./app.js --test=derp' to see it in action
//# sourceMappingURL=app.js.map