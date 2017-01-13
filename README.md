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

After cloning the repository from GitHub, type the following command to install node dependencies:

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

At this time the only functionality is the ability to browse the available files and p

## The data files

The data files with the language content shown in the browser are held with the `data` folder of the application. These data files are in **markdown** format and have a file extension of `.md`.

