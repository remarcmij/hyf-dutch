'use strict'
const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const marked = require('marked')

const database = require('./mongo.database')

const PORT = 8080
let app = null

run()

function run() {
    try {
        database.openDatabase()
            .then(() => {
                setupExpress()
                setupApiEndPointRoutes()
                setupStaticRoutes()
                startServer()
            })
            .catch(err => {
                console.log(err)
                process.exit()
            })
    }
    catch (err) {
        console.log(err)
        process.exit()
    }
}

function setupExpress() {
    app = express()
    app.use(bodyParser.json())
}

function setupApiEndPointRoutes() {
    app.get('/file', getFileEntries);
    app.get('/file/:fileName', getFile)
}

function setupStaticRoutes() {
    app.get('/', sendIndexHtml)
    app.use(express.static(path.resolve(__dirname, '..')))
}

function startServer() {
    app.listen(PORT, err => {
        if (err) {
            throw err
        }
        console.log('server listening at port ' + PORT)
    })
}

// Request handlers

function sendIndexHtml(req, res) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
}

function getFileEntries(req, res) {
    database.getFileEntries()
        .then(files => res.json({files}))
        .catch(err => res.status(400).json(err))
}

function getFile(req, res) {
    let filePath = path.resolve(__dirname, '../data', req.params.fileName + '.md')
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            return res.sendStatus(404)
        }
        content = content.replace(/\*\*(.+?)\*\*/g, '**<span>$1</span>**')
        let html = marked(content, {
            breaks: true,
            smartypants: false
        })

        html =  html.replace(/<table>/gm, '<table class=\'table\'>')

        return res.json({content: html})
    })

}
// module.exports = {
//     dbname: dbname
// }