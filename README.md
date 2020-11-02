# Markdown File Guide Generator  <!-- omit in toc -->

Generates markdown for a \"File Guide\", which is a two-column table with a file structure (made using unicode box-drawing characters) in the first column, and descriptions of what each file is in the second column.

## Table of Contents  <!-- omit in toc -->
- [Example Usage](#example-usage)
- [Example Output](#example-output)
- [How It Works](#how-it-works)
- [Dependencies](#dependencies)
- [License](#license)

## Example Usage
```
import { generate } from './readme-generator'

const markdown = generate('C:\\Projects\\my-project', ['.git', 'dist', 'node_modules'])
console.log(markdown)
```

## Example Output

This is "File Guide" generated by this tool for the code used to create it.

| File/Folder        | Description |
|--------------------|-------------|
| .git/              |             |
| .vscode/           | Contains workspace settings for VSCode. |
|                    | [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings) |
| └─ extensions.json | Specifies recommended VSCode extensions to use when working with this project.        |
|                    | [Workspace recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) |
|                    |  - yzhang.markdown-all-in-one (for previewing markdown and other markdown-related features)
|                    |  - nhoizey.gremlins (for visualizing no break spaces in code) |
| dist/              |             |
| node_modules/      |             |
| src/               |             |
| ├─ app.ts          |             |
| └─ generator.ts    |             |
| .editorconfig      |             |
| .eslintrc.js       |             |
| .gitignore         |             |
| LICENSE            | Contains the MIT License for this project. |
| licenses.json      | Contains information about all the packages this project depends on and their licenses. Generated using npm-license-crawler |
| package-lock.json  |             |
| package.json       |             |
| README.md          |             |
| tsconfig.json      |             |

## How It Works

Each indentation uses 3 characters.  
No-break spaces (U+00A0) are used to ensure proper handling of whitespace.  
Spacers carry a line down past more deeply nested levels and look like this:  
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

## Dependencies

| Name                                | Usage                                   | Version | License      |
| :---------------------------------- | :-------------------------------------- | :------ | :----------: |
| fs                                  | For reading/writing files.              | 0.0.1   | ISC          |
| stringify-object                    | For generating contents of fileguide.js | 3.3.0   | BSD-2-Clause |
| get-own-enumerable-property-symbols | stringify-object dependency             | 3.0.2   | ISC          |
| is-obj                              | stringify-object dependency             | 1.0.1   | MIT          |
| is-regexp                           | stringify-object dependency             | 1.0.0   | MIT          |


## License

Copyright (c) 2020 Nathan Fast

This project is licensed under the MIT license. See the `LICENSE` file for more details.