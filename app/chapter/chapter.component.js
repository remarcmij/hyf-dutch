(function() {
    'use strict'

    class DocumentController {

        static get $inject() {
            return ['speechService']
        }

        constructor(speechService) {
            this.speechService = speechService
        }

        $postLink() {
            this.safeHtml = this.article
        }

    }

    angular.module('app')
        .component('appDocument', {
            template: `<article id="article" ng-bind-html="$ctrl.safeHtml" ng-click="$ctrl.onClick($event)"></article>`,
            bind: {
                article: '<'
            },
            controller: DocumentController
        })

}())
