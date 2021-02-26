"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const generator_1 = require("./generator");
var opts = {
    string: ['rootFolderPath', 'column1Heading', 'column2Heading'],
    default: { rootFolderPath: './' },
    alias: { path: 'rootFolderPath' }
};
var args = minimist(process.argv.slice(2), opts);
const markdown = generator_1.generate(args.rootFolderPath, args._ ?? [], args.column1Heading, args.column2Heading);
console.log(markdown);
// try running 'npm run build' then from project root run:
// node ./dist/app.js --column1Heading=Test1 --column2Heading=Test2 node_modules dist .git
//# sourceMappingURL=app.js.map