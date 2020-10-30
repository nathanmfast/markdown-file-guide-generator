import * as fs from 'fs'
import path = require('path');

interface IFileOrFolder{
    name:string,
    isFile: boolean,
    children: IFileOrFolder[]
}

class ReadmeGenerator {
  _folderNamesToIgnoreFilesIn: string[]
  _column1MaxLength: number
  _column2MaxLength: number

  constructor () {
    this._folderNamesToIgnoreFilesIn = []
    this._column1MaxLength = 0
    this._column2MaxLength = 0
  }

  private getChildren (rootFolderPath: string): IFileOrFolder[] {
    const children:IFileOrFolder[] = []
    var files = fs.readdirSync(rootFolderPath)
    for (var name of files) {
      const filepath = path.resolve(rootFolderPath, name)
      const stat = fs.statSync(filepath)
      let thisChildren: IFileOrFolder[] = []
      const isFile = stat.isFile()
      if (!isFile && !this._folderNamesToIgnoreFilesIn.includes(name)) {
        thisChildren = this.getChildren(filepath)
      }
      children.push({
        name: name + (isFile ? '' : '/'),
        isFile: isFile,
        children: thisChildren
      })
    }
    children.sort((a, b) => {
      // folders come before files
      if (!a.isFile && b.isFile) return -1
      if (a.isFile && !b.isFile) return 1
      // otherwise its alphabetical
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    })
    return children
  }

  // maxLength does not include any whitespace, e.g. "└─ app.ts"
  private getMaxLength (contents: IFileOrFolder[], depth: number = 0) {
    let maxLength = 0
    if (!!contents && contents.length > 0) {
      for (var item of contents) {
        maxLength = Math.max(...[
          item.name.length + (depth * 3), // leader uses 3 characters for each indentation
          this.getMaxLength(item.children, depth + 1),
          maxLength
        ])
      }
    }
    return maxLength
  }

  private getLeader (depth: number, isLast: boolean) {
    let leader = ''
    if (depth > 0) {
      if (depth > 1) {
        const numSpacer = depth - 1
        for (var x = 0; x < numSpacer; x++) {
          leader += '│  '
        }
      }
      leader += (isLast ? '└' : '├') + '─ '
    }
    return leader
  }

  private generateRow (contents: IFileOrFolder[], depth: number = 0) {
    let markdown = ''
    let iterations = contents.length
    for (const item of contents) {
      const leader = this.getLeader(depth, !--iterations)
      markdown += '| '
      markdown += leader
      markdown += item.name.padEnd(this._column1MaxLength - leader.length, ' ')
      markdown += ' | '
      markdown += ''.padEnd(this._column2MaxLength, ' ')
      markdown += ' |'
      markdown += '\n'
      markdown += this.generateRow(item.children, depth + 1)
    }
    return markdown
  }

  public generate (rootFolderPath: string, folderNamesToIgnoreFilesIn: string[], column1Heading: string, column2Heading: string): string {
    this._folderNamesToIgnoreFilesIn = folderNamesToIgnoreFilesIn
    const contents: IFileOrFolder[] = this.getChildren(rootFolderPath)
    this._column1MaxLength = Math.max(...[this.getMaxLength(contents), column1Heading.length])
    this._column2MaxLength = column2Heading.length
    let markdown = ''
    markdown += '| ' + column1Heading.padEnd(this._column1MaxLength, ' ') + ' | ' + column2Heading + ' |\n'
    markdown += '|-' + ''.padEnd(this._column1MaxLength, '-') + '-|-' + ''.padEnd(this._column2MaxLength, '-') + '-|\n'
    markdown += this.generateRow(contents)
    return markdown
  }
}

export const generate = function (rootFolderPath: string, 
  folderNamesToIgnoreFilesIn: string[] = ['.git', 'node_modules'], 
  column1Heading: string = 'File/Folder', 
  column2Heading: string = 'Description') {
  return (new ReadmeGenerator()).generate(rootFolderPath, folderNamesToIgnoreFilesIn, column1Heading, column2Heading)
}
