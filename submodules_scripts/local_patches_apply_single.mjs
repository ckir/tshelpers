#!/usr/bin/env node
import fs from 'node:fs'
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

function getPatchNames(directoryPath) {
    const patches = []
    const files = fs.readdirSync(directoryPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    files.forEach(file => {
        if (!file.toLowerCase().endsWith('.patch')) return
        patches.push(file)
    })
    return patches
}

const moduleName = 'ansi-sequence-parser'
// const moduleName = process.argv[3] || null
const directoryPath = 'submodules_patches'
let cmd

if (!moduleName) {
    console.log('Module name missing')
    process.exit(1)
}
if (!fs.statSync(`${directoryPath}/${moduleName}`).isDirectory()) {
    console.log(`There is no patch folder for[${moduleName}]`)
    process.exit(1)
}

const answer = await rl.question(`This will apply local patches to local folder of [${moduleName}]\nContinue [y/n]? `)
if (!answer.toLocaleLowerCase().includes('y')) {
    console.log('Aborted')
    process.exit(1)
}
rl.close()

const patches = getPatchNames(`${directoryPath}/${moduleName}`)
if (patches.length == 0) {
    console.log(`There are no patches available for [${moduleName}]`)
    process.exit(0)
}
patches.forEach((patch) => {
    cmd = `patch -s -p0 < ${directoryPath}/${moduleName}/${patch}`
    // console.log(cmd)
    run(cmd)
})

