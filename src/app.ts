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