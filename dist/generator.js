"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs = require("fs");
const path = require("path");
var FileSystemEntryType;
(function (FileSystemEntryType) {
    FileSystemEntryType[FileSystemEntryType["File"] = 0] = "File";
    FileSystemEntryType[FileSystemEntryType["Folder"] = 1] = "Folder";
})(FileSystemEntryType || (FileSystemEntryType = {}));
class FileSystemEntry {
}
class FileGuideEntry {
}
const shouldIgnoreFolder = function (name, folderNamesToIgnoreFilesIn) {
    return folderNamesToIgnoreFilesIn.map((x) => x.toLowerCase()).includes(name);
};
const getFileSystemEntries = function (rootFolderPath, folderNamesToIgnoreFilesIn) {
    const fileSystemEntries = [];
    const files = fs.readdirSync(rootFolderPath);
    for (const name of files) {
        let fileSystemEntry = new FileSystemEntry();
        // get file info
        const filepath = path.resolve(rootFolderPath, name);
        const stat = fs.statSync(filepath);
        const type = stat.isFile() ? FileSystemEntryType.File : FileSystemEntryType.Folder;
        // populate child
        fileSystemEntry.name = name + (type === FileSystemEntryType.Folder ? '/' : '');
        fileSystemEntry.type = type;
        if (type === FileSystemEntryType.Folder && !shouldIgnoreFolder(name, folderNamesToIgnoreFilesIn)) {
            fileSystemEntry.children = getFileSystemEntries(filepath, folderNamesToIgnoreFilesIn);
        }
        fileSystemEntries.push(fileSystemEntry);
    }
    fileSystemEntries.sort((a, b) => {
        // folders come before files
        if (a.type === FileSystemEntryType.Folder && b.type === FileSystemEntryType.File)
            return -1;
        if (a.type === FileSystemEntryType.File && b.type === FileSystemEntryType.Folder)
            return 1;
        // otherwise its alphabetical
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });
    return fileSystemEntries;
};
const getMaxLength = function (fileGuideEntries, depth = 0) {
    let maxLength = 0;
    if (fileGuideEntries.length > 0) {
        for (const entry of fileGuideEntries) {
            // this should not include any whitespace, e.g. "└─ app.ts"
            maxLength = Math.max(...[
                entry.name.length + (depth * 3),
                entry.children !== undefined && entry.children !== null ? getMaxLength(entry.children, depth + 1) : 0,
                maxLength
            ]);
        }
    }
    return maxLength;
};
const getLeader = function (depth, isLast) {
    let leader = '';
    if (depth > 0) {
        if (depth > 1) {
            const numSpacer = depth - 1;
            for (let x = 0; x < numSpacer; x++) {
                leader += '│  ';
            }
        }
        leader += (isLast ? '└' : '├') + '─ ';
    }
    return leader;
};
const generateRows = function (fileGuideEntries, depth, column1MaxLength, column2MaxLength) {
    let markdown = '';
    if (fileGuideEntries !== null) {
        let iterations = 0;
        for (const entry of fileGuideEntries) {
            const leader = getLeader(depth, ++iterations === fileGuideEntries.length);
            markdown += '| ';
            markdown += leader;
            markdown += entry.name.padEnd(column1MaxLength - leader.length, ' ');
            markdown += ' | ';
            markdown += ''.padEnd(column2MaxLength, ' ');
            markdown += ' |';
            markdown += '\n';
            if (entry.children !== undefined && entry.children !== null) {
                markdown += generateRows(entry.children, depth + 1, column1MaxLength, column2MaxLength);
            }
        }
    }
    return markdown;
};
const generateHeader = function (column1Heading, column2Heading, column1MaxLength, column2MaxLength) {
    let markdown = '';
    markdown += '| ' + column1Heading.padEnd(column1MaxLength, ' ') + ' | ' + column2Heading + ' |\n';
    markdown += '|-' + ''.padEnd(column1MaxLength, '-') + '-|-' + ''.padEnd(column2MaxLength, '-') + '-|\n';
    return markdown;
};
const getFileGuideEntries = function (fileSystemEntries) {
    return fileSystemEntries.map((x) => {
        let entry = new FileGuideEntry();
        entry.name = x.name;
        if (x.children !== undefined && x.children !== null) {
            entry.children = getFileGuideEntries(x.children);
        }
        return entry;
    });
};
exports.generate = function (rootFolderPath, folderNamesToIgnoreFilesIn = ['.git', 'node_modules'], column1Heading = 'File/Folder', column2Heading = 'Description') {
    if (rootFolderPath === undefined || rootFolderPath === null || rootFolderPath.length === 0 || !fs.existsSync(rootFolderPath)) {
        throw Error('rootFolderPath must be a path to a folder');
    }
    const fileSystemEntries = getFileSystemEntries(rootFolderPath, folderNamesToIgnoreFilesIn);
    const fileGuideEntries = getFileGuideEntries(fileSystemEntries);
    const column1MaxLength = Math.max(...[getMaxLength(fileGuideEntries), column1Heading.length]);
    const column2MaxLength = column2Heading.length;
    return generateHeader(column1Heading, column2Heading, column1MaxLength, column2MaxLength) + generateRows(fileGuideEntries, 0, column1MaxLength, column2MaxLength);
};
//# sourceMappingURL=generator.js.map