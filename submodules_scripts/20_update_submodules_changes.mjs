#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
const rl = readline.createInterface({ input, output })
const answer = await rl.question('This will update every submodule in .gitmodules and apply different patches to local folders \nContinue [y/n]? ')
if (! answer.toLocaleLowerCase().includes('y')) {
    console.log('Aborted')
    process.exit(1)
}
rl.close()

const folderSubmodules = 'submodules'
const folderLocal = 'src'
let cmd

function getSubfoldersNames(directoryPath) {
    const subfolders = []
    const files = fs.readdirSync(directoryPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    files.forEach(function (file) {
        if (fs.statSync(path.join(directoryPath, file)).isDirectory()) {
            subfolders.push(file)
        }
    })
    return subfolders
}

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

cmd = `git submodule update --recursive`
run(cmd)

const submodules = getSubfoldersNames(folderSubmodules)
submodules.forEach((submodule) => {
    const remote = path.join(folderSubmodules, submodule)
    const local = path.join(folderLocal, submodule)
    // -r == recursive, so do subdirectories
    // -u == unified style, if your system lacks it or if recipient
    //       may not have it, use "-c"
    // -N == treat absent files as empty
    cmd = `diff --exclude=.git -ruN ${local} ${remote} | tee /tmp/remote_update.patch`
    run(cmd)
    cmd = `patch -s -p0 < /tmp/remote_update.patch`
    run(cmd)

})

