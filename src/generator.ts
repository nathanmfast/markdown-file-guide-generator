import * as fs from 'fs'
import * as stringify from 'stringify-object'
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

const getFileSystemEntries = function (rootFolderPath: string, folderNamesToIgnoreFilesIn: string[]): IFileSystemEntry[] {
  const fileSystemEntries: IFileSystemEntry[] = []
  var files = fs.readdirSync(rootFolderPath)
  for (var name of files) {
    const fileSystemEntry = new FileSystemEntry()
    // get file info
    const filepath = path.resolve(rootFolderPath, name)
    const stat = fs.statSync(filepath)
    const type = stat.isFile() ? FileSystemEntryType.File : FileSystemEntryType.Folder
    // populate child
    fileSystemEntry.name = name + (type === FileSystemEntryType.Folder ? '/' : '')
    fileSystemEntry.type = type
    if (type === FileSystemEntryType.Folder && !shouldIgnoreFolder(name, folderNamesToIgnoreFilesIn)) {
      fileSystemEntry.children = getFileSystemEntries(filepath, folderNamesToIgnoreFilesIn)
    }
    fileSystemEntries.push(fileSystemEntry)
  }
  fileSystemEntries.sort((a, b) => {
    // folders come before files
    if (a.type === FileSystemEntryType.Folder && b.type === FileSystemEntryType.File) return -1
    if (a.type === FileSystemEntryType.File && b.type === FileSystemEntryType.Folder) return 1
    // otherwise its alphabetical
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  })
  return fileSystemEntries
}

const getMaxLength = function (fileGuideEntries: IFileGuideEntry[], depth: number = 0): number {
  let maxLength = 0
  if (fileGuideEntries.length > 0) {
    for (var entry of fileGuideEntries) {
      // this should not include any whitespace, e.g. "└─ app.ts"
      maxLength = Math.max(...[
        entry.name.length + (depth * 3), // leader uses 3 characters for each indentation
        entry.children !== undefined && entry.children !== null ? getMaxLength(entry.children, depth + 1) : 0,
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

const generateRows = function (fileGuideEntries: IFileGuideEntry[], depth: number, column1MaxLength: number, column2MaxLength: number): string {
  let markdown = ''
  if (fileGuideEntries !== null) {
    let iterations = fileGuideEntries.length
    for (const entry of fileGuideEntries) {
      const leader = getLeader(depth, --iterations === 0)
      markdown += '| '
      markdown += leader
      markdown += entry.name.padEnd(column1MaxLength - leader.length, ' ')
      markdown += ' | '
      markdown += ''.padEnd(column2MaxLength, ' ')
      markdown += ' |'
      markdown += '\n'
      if (entry.children !== undefined && entry.children !== null) {
        markdown += generateRows(entry.children, depth + 1, column1MaxLength, column2MaxLength)
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

interface IFileGuideEntry{
  name: string
  description: string
  children?: IFileGuideEntry[]
}

const fileGuidPath = 'C:\\Projects\\markdown-file-guide-generator\\fileguide.js'

const getFileGuideEntries = function (fileSystemEntries: IFileSystemEntry[]): IFileGuideEntry[] {
  return fileSystemEntries.map((x) => {
    const entry: IFileGuideEntry = {
      name: x.name,
      description: ''
    }
    if (x.children !== undefined && x.children !== null) {
      entry.children = getFileGuideEntries(x.children)
    }
    return entry
  })
}

const readFileGuide = function (): IFileGuideEntry[] {
  return JSON.parse(fs.readFileSync(fileGuidPath, 'utf-8'))
}

const writeFileGuide = function (fileGuideEntries: IFileGuideEntry[]): void {
  const fileGuideContents = stringify(fileGuideEntries, {
    indent: '  ',
    singleQuotes: false
  })
  fs.writeFileSync(fileGuidPath, fileGuideContents, 'utf-8')
}

const updateFileGuide = function (fileGuideEntries: IFileGuideEntry[]): void {
  const previousFileGuideEntries = readFileGuide()

  // TODO: updated fileGuideEntries with info from previousFileGuideEntries
  // for(let entry of fileGuideEntries){
  //   entry.description = previousFileGuideEntries.
  // }
  console.log(previousFileGuideEntries[0].description)

  writeFileGuide(fileGuideEntries)
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
  const fileSystemEntries = getFileSystemEntries(rootFolderPath, folderNamesToIgnoreFilesIn)
  const fileGuideEntries = getFileGuideEntries(fileSystemEntries)
  updateFileGuide(fileGuideEntries)
  const column1MaxLength = Math.max(...[getMaxLength(fileGuideEntries), column1Heading.length])
  const column2MaxLength = column2Heading.length
  return generateHeader(column1Heading, column2Heading, column1MaxLength, column2MaxLength) + generateRows(fileGuideEntries, 0, column1MaxLength, column2MaxLength)
}
