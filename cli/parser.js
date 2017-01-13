'use strict'
const fs = require('fs')
const path = require('path')
const XRegExp = require('xregexp')

const H1_REGEXP = /^#\s+(.*)$/m
const PARENS_REXEXP = /[()]/g
const TARGET_LANG_FRAGMENT = /\*\*(.*?)\*\*/
const WORD_REGEXP = XRegExp(String.raw`[-'\p{L}]{2,}`, 'g')

let baseStopWords = null
let targetStopWords = null
let baseLang = null
let targetLang = null

function initialize(_baseLang, _targetLang) {
    baseLang = _baseLang
    targetLang = _targetLang
    baseStopWords = readStopWords(baseLang)
    targetStopWords = readStopWords(targetLang)
}

function readStopWords(lang) {
    let filePath = path.resolve(__dirname, '../data', lang + '.stopwords.txt')
    let content = fs.readFileSync(filePath, {encoding: 'utf8'})
    let lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line)
    return new Set(lines)
}

function parseFile(content) {

    let {title, subtitle} = extractTitles(content)

    return {
        title,
        subtitle,
        lemmas: extractLemmas(content)
    }
}

function extractTitles(content) {
    let title = null

    let match = content.match(H1_REGEXP)
    if (match) {
        title = match[1]
    } else {
        throw new Error('missing title')
    }

    let subtitle = ''
    const h2RegExp = /^##\s+(.*)$/gm

    match = h2RegExp.exec(content)

    while (match) {
        if (subtitle.length > 0) {
            subtitle += ' • '
        }
        subtitle += match[1]
        match = h2RegExp.exec(content)
    }

    return {title, subtitle}
}

function extractLemmas(content) {
    let lemmas = []
    let lines = content.split('\n')

    let iterator = lines[Symbol.iterator]();

    let item = iterator.next()

    while (!item.done) {
        let line = item.value
        item = iterator.next()

        // TODO: make test more specific
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

// todo: remove  __text__

function extractWords(fragment) {
    fragment = fragment.replace(PARENS_REXEXP, '').trim()
    let lang = /^\*\*/.test(fragment) ? targetLang : baseLang
    let stopWords
    if (lang === targetLang) {
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
    if (words) {
        words = words.map(word => word.toLowerCase())
            .filter(word => !stopWords.has(word))
            .map(word => ({word, lang}))
    }
    return words ? words : []
}

module.exports = {
    initialize,
    parseFile
}