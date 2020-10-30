# Markdown File Guide Generator

## Example Usage

>`import { generate } from './readme-generator'`  
>` `  
>`const markdown = generate('C:\\Projects\\my-project', ['.git', 'dist', 'node_modules'])`  
>`console.log(markdown)`  

## Useful Design Info

The table below lays out a specific example and helps to visualize the logic used to arrange the table and the folder structure in the first column.

| Depth |  1    |  2    |  3    | Name                      |
|-------|-------|-------|-------|---------------------------|
| 0     |       |       |       | src/                      |
| 1     |  ├─   |       |       | ├─ utility/               |
| 2     |  │    |  ├─   |       | │  ├─ subfolder/          |
| 3     |  │    |  │    |  ├─   | │  │  ├─ file1.ts         |
| 3     |  │    |  │    |  └─   | │  │  └─ file2.ts         |
| 2     |  │    |  ├─   |       | │  ├─ tools/              |
| 3     |  │    |  │    |  └─   | │  │  └─ parser.ts        |
| 2     |  │    |  ├─   |       | │  ├─ longer-file-name.ts |
| 2     |  │    |  └─   |       | │  └─ processor.ts        |
| 1     |  └─   |       |       | └─ app.ts                 |