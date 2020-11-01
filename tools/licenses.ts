import * as fs from 'fs'
import path = require('path')
import { report } from 'process'

/*
Sample
{
    "@babel/code-frame@7.10.4": {
        "licenses": "MIT",
        "repository": "https://github.com/babel/babel",
        "licenseUrl": "https://github.com/babel/babel/raw/master/LICENSE",
        "parents": "markdown-file-guide-generator"
    },
    ...
}
*/

interface IDependency{
    name: string
    licenseInfo: ILicenseInfo
}

interface ILicenseInfo{
    licenses: string
    repository: string
    licenseUrl: string
    parents: string
}

const getDependencies =function(): IDependency[]{
    let dependencies: IDependency[] = []
    // this will be an object where each key is the name of a dependency and the value for that key is an ILicenseInfo
    let licensesObject = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\..\\licenses.json'), 'utf-8'))
    Object.keys(licensesObject).map((dependencyName)=>{
        dependencies.push({
            name: dependencyName,
            licenseInfo: licensesObject[dependencyName]
        })
    })
    return dependencies
}

/*
What a shithole this is...

SPDX (Software Package Data Exchange) 
An open standard for communicating software bill of material information, including components, licenses, copyrights, and security references. SPDX reduces redundant work by providing a common format for companies and communities to share important data, thereby streamlining and improving compliance.
https://spdx.org/licenses/
https://www.npmjs.com/package/spdx-expression-parse

https://github.com/delfrrr/npm-consider
great, can recommend. use this to install packages and it will tell you all about dependencies before you do

https://github.com/davglass/license-checker
great, can recommend, tons of contributors and users, relies on spdx packages, works well.
seems like this is what you want to use, and the individual project can determine how to present the info it provides
it would be nice to have some common things covered, 
  like a html snippet of the info (style it in css on your own) or
  a function that spits out the info nicely in the console (so you can get this info for a console app - is that something people do?)

how are attributions handled in differnt software e.g. console app vs website vs app
  example from the readme of another project:
  "winsw and sudowin are the copyrights of their respective owners. winsw is distributed under an MIT license. sudowin is distributed under a BSD license."
  maybe that's all there is to it?


https://github.com/mwittig/npm-license-crawler
wrapper around license-checker. broke af (doesnt honor its own args).

https://github.com/marcelwinh/license-crawler
has some neat features like sorting by package vs license, but its goofy and doesnt rely on spdx packages

https://github.com/ironSource/license-report
generates html (and other formats) report, but its goofy as hell

should turn this file into its own project that relies on licence-checker directly (no output file to deal with, remove dependency on stringify)
for now just do it in here though, then it can be easily moved and posted on its own and re-used in ynab project

*/