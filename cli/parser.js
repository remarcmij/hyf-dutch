'use strict'
const fs = require('fs')
const path = require('path')
const XRegExp = require('xregexp')

const TITLE_REGEXP = /^# *([^#][^\n]+)/m
const PARENS_REXEXP = /[()]/g
const TARGET_LANG_FRAGMENT = /\*\*(.*?)\*\*/
const WORD_REGEXP = XRegExp(String.raw`[-'\p{L}]{2,}`, 'g')

let baseStopWords = null
let targetStopWords = null

function initialize(baseLang, targetLang) {
    baseStopWords = readStopWords(baseLang)
    targetStopWords = readStopWords(targetLang)
}

function readStopWords(lang) {
    let filePath = path.resolve(__dirname, '../data', lang + '.stopword.txt')
    let content = fs.readFileSync(filePath, {encoding: 'utf8'})
    let lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line)
    return new Set(lines)
}

function parseFile(content) {
    let title = null

    let match = content.match(TITLE_REGEXP)
    if (match) {
        title = match[1]
    } else {
        throw new Error('missing title')
    }

    return {
        title,
        lemmas: extractLemmas(content)
    }
}

function extractLemmas(content) {
    let lemmas = []
    let lines = content.split('\n')

    let iterator = lines[Symbol.iterator]();

    let item = iterator.next()

    while (!item.done) {
        let line = item.value
        item = iterator.next()

        if (/^-/.test(line)) {
            let phrase = line.substring(1).trim()
            if (!item.done) {
                let translation = item.value.trim()
                item = iterator.next()
                let newLemmas = extractWords(phrase)
                    .concat(extractWords(translation))
                    .map(lemma => Object.assign(lemma, {phrase, translation}))
                lemmas = lemmas.concat(newLemmas)
            }
        }
    }

    return lemmas
}

// todo: remove  _text_

function extractWords(fragment) {
    fragment = fragment.replace(PARENS_REXEXP, '').trim()
    let lang = /^\*\*/.test(fragment) ? 'target' : 'base'
    let stopWords
    if (lang === 'target') {
        stopWords = targetStopWords
        let match = fragment.match(TARGET_LANG_FRAGMENT)
        if (!match) {
            throw new Error(`invalid target language fragment: '${fragment}'`)
        }
        fragment = match[1];
    } else {
        stopWords = baseStopWords
    }
    let words = fragment.match(WORD_REGEXP)
        .filter(word => !stopWords.)
    return words ? words.map(word => ({word: word.toLowerCase(), lang})) : []
}

module.exports = {
    initialize,
    parseFile
}