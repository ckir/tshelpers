#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
const directoryPath = 'submodules_patches'

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

function getPatchNames(directoryPath) {
    const patches = []
    const files = fs.readdirSync(directoryPath).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    files.forEach(file => {
        if (!file.toLowerCase().endsWith('.patch')) return
        patches.push(file)
    })
    return patches
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

const submodules = getSubfoldersNames(directoryPath)
submodules.forEach((submodule) => {
    console.log(`Appliyng patches to ${submodule}`)
    const patches = getPatchNames(path.join(directoryPath, submodule))
    patches.forEach((patch) => {
        cmd = `patch -s -p0 < ${directoryPath}/${submodule}/${patch}`
        run(cmd)
    })
})

