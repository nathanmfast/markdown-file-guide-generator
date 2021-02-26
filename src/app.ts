import { generate } from './generator'

const markdown = generate('C:\\Projects\\markdown-file-guide-generator', ['node_modules', 'dist', '.git'])
console.log(markdown)

// this is how command line arguments work for a node app
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})