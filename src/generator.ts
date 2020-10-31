import * as fs from 'fs'
import path = require('path');

interface IFileOrFolder{
    name:string,
    isFile: boolean,
    children: IFileOrFolder[]
}

const getChildren = function (rootFolderPath: string, folderNamesToIgnoreFilesIn: string[]): IFileOrFolder[] {
  const children:IFileOrFolder[] = []
  var files = fs.readdirSync(rootFolderPath)
  for (var name of files) {
    const filepath = path.resolve(rootFolderPath, name)
    const stat = fs.statSync(filepath)
    let thisChildren: IFileOrFolder[] = []
    const isFile = stat.isFile()
    if (!isFile && !folderNamesToIgnoreFilesIn.includes(name)) {
      thisChildren = getChildren(filepath, folderNamesToIgnoreFilesIn)
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

const getMaxLength = function (contents: IFileOrFolder[], depth: number = 0) {
  let maxLength = 0
  if (!!contents && contents.length > 0) {
    for (var item of contents) {
      // this should not include any whitespace, e.g. "└─ app.ts"
      maxLength = Math.max(...[
        item.name.length + (depth * 3), // leader uses 3 characters for each indentation
        getMaxLength(item.children, depth + 1),
        maxLength
      ])
    }
  }
  return maxLength
}

const getLeader = function (depth: number, isLast: boolean) {
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

const generateRows = function (contents: IFileOrFolder[], depth: number = 0, column1MaxLength: number, column2MaxLength: number) {
  let markdown = ''
  let iterations = contents.length
  for (const item of contents) {
    const leader = getLeader(depth, !--iterations)
    markdown += '| '
    markdown += leader
    markdown += item.name.padEnd(column1MaxLength - leader.length, ' ')
    markdown += ' | '
    markdown += ''.padEnd(column2MaxLength, ' ')
    markdown += ' |'
    markdown += '\n'
    markdown += generateRows(item.children, depth + 1, column1MaxLength, column2MaxLength)
  }
  return markdown
}

const generateHeader = function (column1Heading: string, column2Heading: string, column1MaxLength: number, column2MaxLength: number) {
  let markdown = ''
  markdown += '| ' + column1Heading.padEnd(column1MaxLength, ' ') + ' | ' + column2Heading + ' |\n'
  markdown += '|-' + ''.padEnd(column1MaxLength, '-') + '-|-' + ''.padEnd(column2MaxLength, '-') + '-|\n'
  return markdown
}

export const generate = function (
  rootFolderPath: string,
  folderNamesToIgnoreFilesIn: string[] = ['.git', 'node_modules'],
  column1Heading: string = 'File/Folder',
  column2Heading: string = 'Description'
): string {
  const contents: IFileOrFolder[] = getChildren(rootFolderPath, folderNamesToIgnoreFilesIn)
  const column1MaxLength = Math.max(...[getMaxLength(contents), column1Heading.length])
  const column2MaxLength = column2Heading.length
  return generateHeader(column1Heading, column2Heading, column1MaxLength, column2MaxLength) + generateRows(contents, 0, column1MaxLength, column2MaxLength)
}
