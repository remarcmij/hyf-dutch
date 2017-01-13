(function () {
    'use strict'

    class ContentController {

        static get $inject() {
            return ['$state']
        }

        constructor($state) {
            this.$state = $state

        }

        openDocument(fileName) {
            this.$state.go('chapter', {fileName})
        }
    }

    angular.module('app')
        .component('appContent', {
            templateUrl: 'app/content/content.component.html',
            controller: ContentController,
            bindings: {
                fileEntries: '<'
            }
        })

}())
