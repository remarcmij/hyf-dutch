'use strict'
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const database = require('../server/mongo.database')

function loadDocuments() {
    database.openDatabase()
        .then(() => database.dropFileEntriesCollection())
        .then(() => getFileNames())
        .then(fileNames => {
            return sequence(fileNames, loadDocument)
        })
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
        let globPattern = path.join(__dirname, '../docs', '*.md')
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
    return readFile(filePath)
        .then(content => {
            console.log(filePath)
            database.addFileEntry({
                fileName: path.basename(filePath),
                title: 'some title'
            })
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