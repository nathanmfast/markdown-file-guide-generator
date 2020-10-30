import * as fs from 'fs'
import path = require('path');

interface IFileOrFolder{
    name:string,
    isFile: boolean,
    children: IFileOrFolder[]
}

class ReadmeGenerator {
  _folderNamesToIgnoreFilesIn: string[]
  _maxLength: number

  constructor (folderNamesToIgnoreFilesIn?: string[]) {
    this._folderNamesToIgnoreFilesIn = folderNamesToIgnoreFilesIn
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
        name: name,
        isFile: isFile,
        children: thisChildren
      })
    }
    children.sort((a, b) => {
      if (!a.isFile && b.isFile) return -1
      if (a.isFile && !b.isFile) return 1
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    })

    return children.map((x) => {
      return {
        ...x,
        name: x.name + (x.isFile ? '' : '/')
      }
    })
  }

  private getMaxLength (contents: IFileOrFolder[], depth: number = 0): number {
    if (!contents || contents.length === 0) {
      return 0
    }
    let maxLength: number = 0
    for (var item of contents) {
      const length:number = item.name.length + (depth * 2) // however many characters you need for each nested folder
      if (length > maxLength) {
        maxLength = length
      }
      const childrenMaxLength: number = this.getMaxLength(item.children, depth + 1)
      if (childrenMaxLength > maxLength) {
        maxLength = childrenMaxLength
      }
    }
    return maxLength
  }



  private getLeader(depth: number, isLast: boolean): string{
    let leader = ''
    if(depth > 0){
    if(depth > 1){
      let numSpacer = depth - 1
      for (var x = 0; x < numSpacer; x++) {
        leader += '│  '
      }
    }
    leader += isLast ? '└' : '├'
    leader += '─ '
  }
    return leader
    /*
    switch(depth){
      case 0:
        return ''
      case 1:
        return 'xx '
      case 2:
        return 'x   xx '
      case 3:
        return 'x   x   xx '
      default:
        return 'FUCK'
    }
    */

  }

  private generateRow (contents: Array<IFileOrFolder>, depth: number = 0) : string {
    let markdown :string = ''
    let iterations = contents.length;
    for (const item of contents) {
      iterations--
      markdown += '| '

      let leader = this.getLeader(depth, !iterations)
      //markdown += ''.padEnd(depth * 2)
      markdown += leader

      markdown += item.name.padEnd(this._maxLength - leader.length + 2, ' ')
      markdown += '|'
      markdown += ' |'
      markdown += '\n'
      markdown += this.generateRow(item.children, depth + 1)
    }
    return markdown
  }

  public generate (rootFolderPath: string): string {
    const contents: IFileOrFolder[] = this.getChildren(rootFolderPath)
    console.log(contents)

    this._maxLength = this.getMaxLength(contents)

    return this.generateRow(contents)
  }
}

export const generate = function (rootFolderPath: string, folderNamesToIgnoreFilesIn?: string[]): string {
  const generator: ReadmeGenerator = new ReadmeGenerator(folderNamesToIgnoreFilesIn)
  return generator.generate(rootFolderPath)
}
