# Hack Your Dutch

## A reference application for the Hack Your Future refugee training programme

This application is intended as both learning material for programme participants aspiring to become full-stack web developers, as well a practical tool for helping those same participants getting a grip on the Dutch language.

It is written as a MEAN full-stack application:

- MongoDB
- Express 4
- Angular 1.6
- Node 6.x LTS

In addition, the following libraries are used:

- Angular Material 1.x
- AngularUI Router 1.x
- marked (Markdown)
- XRegExp

Although not strictly required, it is recommended to view/modify/debug this application using the Microsoft VSCode editor, an open source tool with many features out-of-the-box geared towards JavaScript/TypeScript developers.

## Installation

After cloning the repository from GitHub, `cd` into the `hyf-dutch` directory and type the following command to install the node dependencies:

```
npm install
```

This application makes use of MongoDB. Make sure that the mongo demon is started before continuing. Then type the following to initialize the database:

```
npm run loader
```

Next start the server part of the application by typing:

```
npm start
```

To access the application, point your browser to:

```
http://localhost:8080
```

At this time the only functionality is the ability to browse the available files and click on Dutch texts to hear them spoken out using speech synthesis.

## The data files

The data files with the language content shown in the browser are held with the `data` folder of the application. These data files are in **markdown** format and have a file extension of `.md`.

The application adds a layer of interpretation on top of the base markdown syntax. Each file must start with an **h1** header, in markdown signified by a `#` sign:

```
# This is the main title
```

Further headings (h1..h5) can be added using the markdown repeated `#` sign but are not given further interpretation by the app.

All text with double asterisks, a markdown syntax for making text **bold**, is given the additional interpretation of signifying Dutch text. Text enclosed within double underscores is also made __bold__ in markdown but is not interpreted as Dutch by the app.

A special format must be used for phrase/translation pairs that are to included in the searchable index (WIP). They should consist of a markdown unordered list item consisting of two lines, for example:

```
- **Dutch phrase**
English translation
```

or

```
- English phrase
**Dutch translation**
```

When markdown files are changed in or added to the `data` folder, the server should be stopped with `Ctrl-C` and the loader should be run again:

```
npm run loader
npm start
```

Note that the data folder also contains text files with a `.txt` extension. They will used for the search facility to prevent certain words (stop words) being indexed.


