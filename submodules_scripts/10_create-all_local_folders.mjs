#!/usr/bin/env node
import fs from 'node:fs'
import { execSync } from 'node:child_process'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
const rl = readline.createInterface({ input, output })
const answer = await rl.question('This will create (if not exists) local copies of every submodule in .gitmodules \nContinue [y/n]? ')
if (! answer.toLocaleLowerCase().includes('y')) {
    console.log('Aborted')
    process.exit(1)
}
rl.close()


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

let gitmodules = fs.readFileSync('.gitmodules', 'utf8')
const regex = /\[submodule "(.+)"\]\n\s+path = (.+)\n\s+url = (.+)/g
let match

while ((match = regex.exec(gitmodules))) {

    let [, submodule, path, url] = match
    if (!submodule.includes('submodules')) continue
    console.log(`\nProcessing: [${submodule}] [${path}] [${url}]`)
    submodule = submodule.split('/')[1]
    const localFolder = `src/${submodule}`
    const patchFolder = `submodules_patches/${submodule}`

    if (!fs.existsSync(localFolder)) {
        console.log(`Local folder ${localFolder} not exists. Creating`)
        cmd = `bash -c "shopt -s dotglob && cp -r ${path} ${localFolder}"`
        run(cmd)
        cmd = `rm ${localFolder}/.git`
        run(cmd)
        if (!fs.existsSync(patchFolder)) {
            cmd = `mkdir ${patchFolder}`
            run(cmd)
        }   
        console.log(`Local folder [${localFolder}] created`)
    } else {
        console.log(`Local folder [${localFolder}] exists. Skipping`)
    }

}