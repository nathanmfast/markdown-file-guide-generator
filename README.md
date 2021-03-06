# Markdown File Guide Generator  <!-- omit in toc -->

Generates markdown for a \"File Guide\", which is a two-column table with a file structure (made using unicode box-drawing characters) in the first column, and descriptions of what each file is in the second column.

<br />

## Table of Contents  <!-- omit in toc -->
- [How to Build and Use](#how-to-build-and-use)
- [Arguments](#arguments)
- [File Guide](#file-guide)
- [How the Markdown File Guide Generator Works](#how-the-markdown-file-guide-generator-works)
- [Dependencies](#dependencies)
- [License](#license)

<br />

## How to Build and Use

As with any node project, before doing anything you'll need to navigate to the project root and run `npm install`.

Run `npm run lint` to run the linter if you make any modifications to the code. This will ensure all code meets `eslint:recommended` and `standard-with-typescript` rules.

Run `npm run build` to build the application. This compiled application will be placed in `dist/`.  

Run `npm run start` to build and run the application with the settings used to generate the table in the File Guide in this README.

Run `npm run package` to build the application and produce distributables for windows/mac/linux. The compiled application will be placed in `dist/` folder, and the executables will be placed in `dist/` subfolders for their respective platforms.

I make frequent use of this library to produce File Guides in projects as well as normal folders on my machine to document what everything is. To do this, I place the windows executable in a folder along with other similar utilities I use, and I have that folder on my path. Then I can easily get a File Guide for any folder by just typing `mdfg`.

<br />

## Arguments

There are currently three named arguments:
- `rootFolderPath`
- `column1Heading`
- `column2Heading`

For each of these, you can specify it like this example: 
```
mdfg --rootFolderPath="c:\scripts"
```

There's also an unnamed argument for listing out folder names to ignore files in. Example:
```
mdfg node_modules .git "folder with spaces"
```
Notice that if a folder name contains spaces, you need to wrap it in quotes.  

Any folder with one of the specified names will not have its contents included in the File Guide. The folder itself will still be listed.

<br />

## File Guide

This "File Guide" was generated by this tool (and then Descriptions were filled in).

| File/Folder &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|-----------------------------------|-------------|
| .git/                             | The git repository. |
| .vscode/                          | Contains workspace settings for VSCode ([User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings)). |
| └─ extensions.json<br/><br/><br/> | Specifies recommended VSCode extensions to use when working with this project ([Workspace recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions)).<br />For previewing markdown and other markdown-related features: `yzhang.markdown-all-in-one`<br />For visualizing no break spaces in code: `nhoizey.gremlins` |
| dist/                             | Contains the JavaScript files (`*.js`) and their source maps (`*.js.map`) compiled from the TypeScript files (`*.ts`) in `src/` as defined by the Typescript configuration file (`tsconfig.json`). |
| node_modules/                     | Packages installed by running `npm install` end up here. |
| src/                              | Contains the TypeScript files (`*.ts`) that will be compiled to create this package. |
| ├─ app.ts                         | The application starts here. This code handles command line arguments imports the generator (`generator.ts`) to do the heavy lifting. |
| └─ generator.ts                   | The markdown file guide generator. Exports the `generate` function that can be used to generate markdown file guides. |
| .editorconfig                     | Helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs ([.editorconfig](https://editorconfig.org/)]). |
| .eslintrc.js<br/><br/>            | ESLint Configuration File ([Configuring ESLint](https://eslint.org/docs/user-guide/configuring#configuration-file-formats)).<br/>This project uses the recommended ESLint rules (`eslint:recommend`) and [JavasScript Standard Style](https://standardjs.com/) for TypeScript (`standard-with-typescript`). |
| .gitignore<br/><br/>              | Specifies intentionally untracked files to ignore for version control ([.gitignore](https://git-scm.com/docs/gitignore)).<br />This project only ignores `dist/` and `node_modules/`. |
| LICENSE                           | Contains the MIT License for this project. |
| package-lock.json                 | Used by npm to describe the dependency tree for the project, for various purposes ([npm-package-lock.json](https://docs.npmjs.com/configuring-npm/package-lock-json.html)). |
| package.json                      | Provides information to npm to identify the project and its dependencies ([npm-package.json](https://docs.npmjs.com/configuring-npm/package-json.html)). |
| README.md                         | This file. The first one you should read to understand what this project is. Formatted using markdown. |
| tsconfig.json                     | TypeScript configuration file ([tsconfig.js](https://www.typescriptlang.org/tsconfig)) to specify compiler options and input/output directories. |

<br />

## How the Markdown File Guide Generator Works

Each indentation uses 3 characters.  
No-break spaces (U+00A0) are used to ensure proper handling of whitespace.  
Spacers carry a line down past more deeply nested levels and look like this (note that the recommended extensions for the project allow you to visualize the no-break spaces, which makes it a bit easier to see what you're supposed to see below):  
```
│  
```
After however many spacers are needed for the depth you are at, use:
```
├─   
```
Or, if it is the last item in the folder:
```
└─   
```

The table below lays out a specific example and helps to visualize the logic used.

| Depth | Last |  1    |  2    |  3    | Name                      |
|-------|------|-------|-------|-------|---------------------------|
| 0     |      |       |       |       | folder/                   |
| 1     |      |  ├─   |       |       | ├─ subfolder/             |
| 2     |      |  │    |  ├─   |       | │  ├─ subfolder1/         |
| 3     |      |  │    |  │    |  ├─   | │  │  ├─ file1.ts         |
| 3     |  Y   |  │    |  │    |  └─   | │  │  └─ file2.ts         |
| 2     |      |  │    |  ├─   |       | │  ├─ subfolder2/         |
| 3     |  Y   |  │    |  │    |  └─   | │  │  └─ file3.ts         |
| 2     |      |  │    |  ├─   |       | │  ├─ longer-file-name.ts |
| 2     |  Y   |  │    |  └─   |       | │  └─ file4.ts            |
| 1     |  Y   |  └─   |       |       | └─ file5.ts               |

<br />

## Dependencies

| Name                                | Usage                                   | Version | License      |
| :---------------------------------- | :-------------------------------------- | :------ | :----------: |
| minimist                            | For easy command-line argument parsing. | 1.2.5   | MIT          |

<br />

## License

Copyright (c) 2021 Nathan Fast

This project is licensed under the MIT license. See the `LICENSE` file for more details.

<br />

# TODO <!-- omit in toc -->

 - [ ] Create "--help" command line argument response.
 - [ ] Add a boolean option for ignoring subfolders.
