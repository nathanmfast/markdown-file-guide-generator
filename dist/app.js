"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const generator_1 = require("./generator");
var args = minimist(process.argv.slice(2));
const markdown = generator_1.generate('./', ['node_modules', 'dist', '.git'], args.column1Heading, args.column2Heading);
console.log(markdown);
// try running 'npm run build' then 'node ./app.js --column1Heading=Derp' to see it in action
//# sourceMappingURL=app.js.map