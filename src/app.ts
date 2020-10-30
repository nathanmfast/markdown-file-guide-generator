import * as fs from 'fs'
import path = require('path');

interface IFileOrFolder{
    name:string,
    isFile: boolean,
    children: IFileOrFolder[]
}

// let rootFolder: IFileOrFolder = {
//     name: "DERP",
//     isFile:false,
//     children: []
// }

const getChildren = async function (rootFolderPath: string): Promise<IFileOrFolder[]> {
  return new Promise((resolve, reject) => {
    let children:IFileOrFolder[] = []
    fs.readdir(rootFolderPath, function (error: any, fileNames: string[]) {
      if (error) throw error
      // fileNames.sort((filename)=>{
      // })
      for (var filename in fileNames) {
        // get current file name
        const name = path.parse(filename).name
        // get current file extension
        // const ext = path.parse(filename).ext
        // get current file path
        const filepath = path.resolve(rootFolderPath, filename)
        // get information about the file
        fs.stat(filepath, async function (error, stat) {
          if (error) throw error
          const isFile = stat.isFile()
          if (!isFile) {
            children = await getChildren(filepath)
          }
          const fileOrFolder:IFileOrFolder = {
            name: name,
            isFile: isFile,
            children: children
          }
          children.push(fileOrFolder)
        })
      }
    })
    return children
  })
}

export const generate = async function (rootFolderPath: string) {
  const contents: IFileOrFolder[] = await getChildren(rootFolderPath)
  console.log(contents)
}

/*
  fs.readdir(rootFolderPath, (err, files) => {
    if (err) {
      throw err
    }

    for (var file of files) {
      console.log(file)
    }
    // files.forEach(file => {
    //   console.log(file);
    // });
  })
}
*/
generate('C:\\Projects\\readme-file-guide')
