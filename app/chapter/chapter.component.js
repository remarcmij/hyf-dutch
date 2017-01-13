(function() {
    'use strict'

    class DocumentController {

        static get $inject() {
            return ['$sce', 'speechService']
        }

        constructor($sce, speechService) {
            this.$sce = $sce
            this.speechService = speechService
        }

        $onInit() {
            this.safeHtml = this.$sce.trustAs('html', this.content)
        }

        onClick(ev) {
            if (this.speechService.isSpeechSynthesisSupported()) {
                let target = ev.target;
                if (target.tagName === 'SPAN') {
                    let text = target.innerText.trim()
                    this.speechService.speak(text, 'nl-NL')
                }
            }
        }

    }

    angular.module('app')
        .component('appChapter', {
            templateUrl: 'app/chapter/chapter.component.html',
            bindings: {
                content: '<'
            },
            controller: DocumentController
        })

}())
