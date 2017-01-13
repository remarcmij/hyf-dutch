(function() {
    'use strict'

    class MainController {

        static get $inject() {
            return ['speechService']
        }

        constructor(speechService) {
            this.speechService = speechService
        }

        onClick() {
            this.speechService.speak('Hello, world', 'en-US')
                .then(() => this.speechService.speak('Hallo, wereld', 'nl-NL'))
                .catch(err => console.log(err))
        }
    }

    angular.module('app')
        .component('appComponent', {
            templateUrl: 'app/app.component.html',
            controller: MainController
        })

}())
