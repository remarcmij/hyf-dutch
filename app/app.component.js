import angular from 'angular'

const template = require('./app.component.html')

class MainController {

    static get $inject() {
        return ['speechService']
    }

    constructor(speechService) {
        this.speechService = speechService;
    }

    onClick() {
        this.speechService.speak('Hello, world', 'en-GB')
            .then(() => this.speechService.speak('Hallo, wereld', 'nl-NL'))
            .catch(err => console.log(err))
    }
}

const name = 'hyfDutch';
angular.module('app')
    .component(name, {
        template,
        controller: MainController
    });
export default name;
