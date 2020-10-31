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

const reportUniqueLicenses = function():void{
    let uniqueLicenses: string[] = []
    let dependencies = getDependencies()
    for(let dependency of dependencies){
        let licensesValue = dependency.licenseInfo.licenses
        let licenses: string[] = []
        // need to detect (LICENSE1 OR LICENSE2) and add separately in that situation
        // https://regex101.com/r/oAllG0/1/
        const multipleRegex = /^\((.+)\sOR\s(.+)\)$/g
        const match = multipleRegex.exec(licensesValue)
        if(match){
            licenses.push(match[1])
            licenses.push(match[2])
        }
        else{
            licenses.push(licensesValue)
        }
        for(let license of licenses){
            if(uniqueLicenses.indexOf(license) === -1) {
                uniqueLicenses.push(license);
            }
        }
    }
    uniqueLicenses.sort()

    console.log('Unique Licenses:\n')
    console.log(uniqueLicenses.map((x)=>'- ' + x).join('\n'))
    console.log('\n')
}

reportUniqueLicenses()


