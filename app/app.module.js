(function() {
    'use strict'

    angular.module('app')
        .run(run)

    run.$inject = ['speechService']

    function run(speechService) {
        speechService.setup()
            .catch(err => console.log(err))
    }

}())

