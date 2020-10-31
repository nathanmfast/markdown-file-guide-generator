import * as fs from 'fs'
import path = require('path')

enum FileSystemEntryType{
  File,
  Folder
}

interface IFileSystemEntry{
  name: string
  type: FileSystemEntryType
  children?: IFileSystemEntry[]
}

class FileSystemEntry implements IFileSystemEntry {
  name: string
  type: FileSystemEntryType
  children?: IFileSystemEntry[]
}

const shouldIgnoreFolder = function (name: string, folderNamesToIgnoreFilesIn: string[]): boolean {
  return folderNamesToIgnoreFilesIn.map((x) => x.toLowerCase()).includes(name)
}

const getChildren = function (rootFolderPath: string, folderNamesToIgnoreFilesIn: string[]): IFileSystemEntry[] {
  const children: IFileSystemEntry[] = []
  var files = fs.readdirSync(rootFolderPath)
  for (var name of files) {
    const child = new FileSystemEntry()
    // get file info
    const filepath = path.resolve(rootFolderPath, name)
    const stat = fs.statSync(filepath)
    const type = stat.isFile() ? FileSystemEntryType.File : FileSystemEntryType.Folder
    // populate child
    child.name = name + (type === FileSystemEntryType.Folder ? '/' : '')
    child.type = type
    if (type === FileSystemEntryType.Folder && !shouldIgnoreFolder(name, folderNamesToIgnoreFilesIn)) {
      child.children = getChildren(filepath, folderNamesToIgnoreFilesIn)
    }
    children.push(child)
  }
  children.sort((a, b) => {
    // folders come before files
    if (a.type === FileSystemEntryType.Folder && b.type === FileSystemEntryType.File) return -1
    if (a.type === FileSystemEntryType.File && b.type === FileSystemEntryType.Folder) return 1
    // otherwise its alphabetical
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  })
  return children
}

const getMaxLength = function (contents: IFileSystemEntry[], depth: number = 0): number {
  let maxLength = 0
  if (contents.length > 0) {
    for (var item of contents) {
      // this should not include any whitespace, e.g. "└─ app.ts"
      maxLength = Math.max(...[
        item.name.length + (depth * 3), // leader uses 3 characters for each indentation
        item.children !== undefined && item.children !== null ? getMaxLength(item.children, depth + 1) : 0,
        maxLength
      ])
    }
  }
  return maxLength
}

const getLeader = function (depth: number, isLast: boolean): string {
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

const generateRows = function (contents: IFileSystemEntry[], depth: number, column1MaxLength: number, column2MaxLength: number): string {
  let markdown = ''
  if (contents !== null) {
    let iterations = contents.length
    for (const item of contents) {
      const leader = getLeader(depth, --iterations === 0)
      markdown += '| '
      markdown += leader
      markdown += item.name.padEnd(column1MaxLength - leader.length, ' ')
      markdown += ' | '
      markdown += ''.padEnd(column2MaxLength, ' ')
      markdown += ' |'
      markdown += '\n'
      if (item.children !== undefined && item.children !== null) {
        markdown += generateRows(item.children, depth + 1, column1MaxLength, column2MaxLength)
      }
    }
  }
  return markdown
}

const generateHeader = function (column1Heading: string, column2Heading: string, column1MaxLength: number, column2MaxLength: number): string {
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
  if (rootFolderPath === undefined || rootFolderPath === null || rootFolderPath.length === 0 || !fs.existsSync(rootFolderPath)) {
    throw Error('rootFolderPath must be a path to a folder')
  }
  const contents = getChildren(rootFolderPath, folderNamesToIgnoreFilesIn)
  // fs.writeFile('C:\\Projects\\markdown-file-guide-generator\\fileguide.json', JSON.stringify(contents), (e) => {
  //   if (e !== null) throw e
  // })
  const column1MaxLength = Math.max(...[getMaxLength(contents), column1Heading.length])
  const column2MaxLength = column2Heading.length
  return generateHeader(column1Heading, column2Heading, column1MaxLength, column2MaxLength) + generateRows(contents, 0, column1MaxLength, column2MaxLength)
}
