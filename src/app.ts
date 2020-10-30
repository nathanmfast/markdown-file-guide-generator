import { generate } from './readme-generator'

const markdown = generate('C:\\Projects\\readme-file-guide', ['node_modules', 'dist', '.git'])
console.log(markdown)