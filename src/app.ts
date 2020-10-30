import { generate } from './readme-generator'

let markdown:string = generate('C:\\Projects\\readme-file-guide', ['node_modules', 'dist', '.git'])
console.log(markdown)
