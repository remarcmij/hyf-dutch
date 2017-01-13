'use strict'
const mongo = require('mongodb').MongoClient

const DBNAME = 'hyf-dutch'
let fileEntryCollection
let lemmaCollection

function openDatabase() {
    const mongoUrl = 'mongodb://localhost:27017/' + DBNAME

    return mongo.connect(mongoUrl)
        .then(db => {
            fileEntryCollection = db.collection('fileEntries')
            lemmaCollection = db.collection('lemmas')
            lemmaCollection.ensureIndex({fileName: 1})
            console.log('Connected to Mongo database...')
        })
        .catch(err => {
            console.log('Could not connect to Mongo database')
            throw err
        })
}

function getFileEntries() {
    return fileEntryCollection.find({}).toArray()
}

function getFileEntryByFileName(fileName) {
    return fileEntryCollection.findOne({fileName})
}

function addFileEntry(doc) {
    doc.timestamp = Date.now()
    return fileEntryCollection.insertOne(doc)
        .then(result => result.insertedId)
}

function updateFileEntry(fileEntry) {
    return fileEntryCollection.updateOne({
        _id: fileEntry._id
    }, {
        fileName: fileEntry.fileName,
        title: fileEntry.title,
        timestamp: Date.now()
    })
}

function deleteFileEntryByFileName(fileEntry) {
    return fileEntryCollection.deleteOne({fileName})
}

function insertLemmas(fileName, lemmas) {
    let bulk = lemmaCollection.initializeUnorderedBulkOp()

    for (let lemma of lemmas) {
        bulk.insert({
            word: lemma.word,
            lang: lemma.lang,
            phrase: lemma.phrase,
            translation: lemma.translation,
            fileName: fileName
        })
    }

    return new Promise((resolve, reject) => {
        bulk.execute(err => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function dropFileEntryCollection() {
    return fileEntryCollection.drop()
        .catch(() => {
            // ignore error
        })
}

function dropLemmaCollection() {
    return lemmaCollection.drop()
        .catch(() => {
            // ignore error
        })
}

function ensureIndexes() {
    return lemmaCollection.ensureIndex({word: 1})
}

module.exports = {
    openDatabase,
    getFileEntries,
    getFileEntryByFileName,
    addFileEntry,
    updateFileEntry,
    deleteFileEntryByFileName,
    insertLemmas,
    dropFileEntryCollection,
    dropLemmaCollection,
    ensureIndexes
}