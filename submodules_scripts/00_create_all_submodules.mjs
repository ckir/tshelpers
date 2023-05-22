#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'node:fs'
import { execSync } from 'node:child_process'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
const rl = readline.createInterface({ input, output })

const CONFIG = [
    'https://github.com/blake-mealey/ansi-sequence-parser.git',
    'https://code.lag.net/robey/antsy.git'
]
const folderSubmodules = `submodules`
let cmd

function run(cmd) {
    try {
        let { stdout, stderr } = execSync(cmd)
        console.log(cmd)
        return { stdout, stderr }
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

const answer = await rl.question(`This will create (if not exists) submodules for\n${CONFIG.join('\n')} \nContinue [y/n]? `)
if (! answer.toLocaleLowerCase().includes('y')) {
    console.log('Aborted')
    process.exit(1)
}
rl.close()

cmd = `mkdir -p submodules; touch submodules/.gitignore`
run(cmd)
cmd = `mkdir -p submodules_patches; touch submodules_patches/.gitignore`
run(cmd)

CONFIG.forEach((gitUrl) => {

    let moduleName = gitUrl.split('.')
    moduleName = moduleName[moduleName.length - 2]
    moduleName = moduleName.split('/')
    moduleName = moduleName[moduleName.length - 1]
    if (fs.existsSync(`${folderSubmodules}/${moduleName}`)) {
        console.log(`Submodule [${moduleName}] already exists. Skipping ...`)
        return
    }
    cmd = `cd ${folderSubmodules} && git submodule add ${gitUrl}`
    run(cmd)

})
