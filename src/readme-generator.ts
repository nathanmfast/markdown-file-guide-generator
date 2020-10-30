import * as fs from 'fs'
import path = require('path');

interface IFileOrFolder{
    name:string,
    isFile: boolean,
    children: IFileOrFolder[]
}

class ReadmeGenerator {
  _folderNamesToIgnoreFilesIn: string[]

  constructor (folderNamesToIgnoreFilesIn?: string[]) {
    this._folderNamesToIgnoreFilesIn = folderNamesToIgnoreFilesIn
  }

  private getChildren (rootFolderPath: string): IFileOrFolder[] {
    let children:IFileOrFolder[] = []
    var dir = fs.readdirSync(rootFolderPath)
    for (var item of dir) {
      // get current file name
      let name = path.parse(item).name
      // get current file path
      let filepath = path.resolve(rootFolderPath, item)
      // get information about the file
      let stat = fs.statSync(filepath)
      // assemble IFileOrFolder
      let thisChildren: IFileOrFolder[] = []
      let isFile = stat.isFile()
      if (!isFile && !this._folderNamesToIgnoreFilesIn.includes(name)) {
        thisChildren = this.getChildren(filepath)
      }
      children.push({
        name: name,
        isFile: isFile,
        children: thisChildren
      })
    }
    return children
  }

  private getMaxLength (contents: IFileOrFolder[]): number{
    //short-circuit
    if(!contents || contents.length === 0){
        return 0
    }
    let maxLength: number = 0
    for(var item of contents){
        let length:number = item.name.length
        if(length> maxLength){
            maxLength = length
        }
        let childrenMaxLength: number = this.getMaxLength(item.children)
        if(childrenMaxLength> maxLength){
            maxLength= childrenMaxLength
        }
    }
    return maxLength
  }

  public generate (rootFolderPath: string): string {
    const contents: IFileOrFolder[] = this.getChildren(rootFolderPath)

    console.log(contents)
    let markdown: string = ''

    //TODO: Generate that markdown table now
    let maxLength: number = this.getMaxLength(contents)
    for(var item of contents){
        markdown += '| '
        markdown += item.name.padEnd(maxLength)
        markdown += ' |'
        markdown += ' |'
        markdown += '\n'
    }
    
    return markdown
  }
}

export const generate = function (rootFolderPath: string, folderNamesToIgnoreFilesIn?: string[]): string {
  const generator: ReadmeGenerator = new ReadmeGenerator(folderNamesToIgnoreFilesIn)
  return generator.generate(rootFolderPath)
}
