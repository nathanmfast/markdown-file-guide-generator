import { generate } from './generator'

const markdown = generate('C:\\Projects\\markdown-file-guide-generator', ['node_modules', 'dist', '.git'])
console.log(markdown)
