(function() {
    'use strict'

    angular.module('app', ['ngMaterial', 'ui.router'])
        .config(routing)
        .run(run)

    routing.$config = ['$stateProvider', '$urlRouterProvider']
    function routing($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                component: 'appContent',
                resolve: {
                    fileEntries: resolveFileEntries
                }
            })
            .state('chapter', {
                url: '/chapter/:fileName',
                component: 'appChapter',
                resolve: {
                    content: resolveFile
                }
            })

        $urlRouterProvider.otherwise('/')
    }

    run.$inject = ['speechService']
    function run(speechService) {
        speechService.setup()
            .catch(err => console.log(err))
    }

    resolveFileEntries.$inject = ['backendService']
    function resolveFileEntries(backendService) {
        return backendService.getFileEntries()
    }

    resolveFile.$inje$templateCache = ['$stateParams', 'backendService']
    function resolveFile($stateParams, backendService) {
        return backendService.getFile($stateParams.fileName)
    }

}())

