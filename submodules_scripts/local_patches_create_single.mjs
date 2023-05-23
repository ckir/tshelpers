#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
const rl = readline.createInterface({ input, output })

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

const moduleName = 'ansi-sequence-parser'
// const moduleName = process.argv[3] || null
const folderSubmodules = 'submodules'
const folderLocal = 'src'
const folderPatches = 'submodules_patches'
let cmd

if (!moduleName) {
    console.log('Module name missing')
    process.exit(1)
}
if (!fs.statSync(`${folderSubmodules}/${moduleName}`).isDirectory()) {
    console.log(`There is no submodule named [${moduleName}]`)
    process.exit(1)
}

const answer = await rl.question(`This will create patches of local changes for module [${moduleName}]\nContinue [y/n]? `)
if (!answer.toLocaleLowerCase().includes('y')) {
    console.log('Aborted')
    process.exit(1)
}
rl.close()

cmd = `mkdir -p ${folderSubmodules}/${moduleName}`
run(cmd)
cmd = `touch ${folderPatches}/${moduleName}/.gitignore`
run(cmd)

const remote = path.join(folderSubmodules, moduleName)
const local = path.join(folderLocal, moduleName)
// -r == recursive, so do subdirectories
// -u == unified style, if your system lacks it or if recipient
//       may not have it, use "-c"
// -N == treat absent files as empty
cmd = `diff -ruN ${remote} ${local} | tee ${folderPatches}/${moduleName}/${new Date().toISOString().split('.')[0].replace(/:/g,'_')}.patch`
run(cmd)

cmd = `git add .`
run(cmd)