'use strict'
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const database = require('../server/mongo.database')
const parser = require('./parser')

function loadDocuments() {
    parser.initialize('en', 'nl')

    database.openDatabase()
        .then(() => database.dropFileEntryCollection())
        .then(() => database.dropLemmaCollection())
        .then(() => getFileNames())
        .then(fileNames => sequence(fileNames, loadDocument))
        .then(() => database.ensureIndexes())
        .then(() => {
            process.exit()
        })
        .catch(err => {
            console.log(err)
            process.exit()
        })
}

function getFileNames() {
    return new Promise((resolve, reject) => {
        let globPattern = path.join(__dirname, '../data', '*.md')
        glob(globPattern, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}

function sequence(array, doWork) {
    return array.reduce((promise, item) => {
        return promise.then(() => doWork(item))
    }, Promise.resolve())
}

function loadDocument(filePath) {
    console.log(`loading ${filePath} ...`)
    return readFile(filePath)
        .then(content => {
            let result = parser.parseFile(content)
            let fileName = path.basename(filePath, '.md')
            return database.addFileEntry({
                fileName,
                title: result.title,
                subtitle: result.subtitle
            }).then(() => database.insertLemmas(fileName, result.lemmas))
        })
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
}


loadDocuments()