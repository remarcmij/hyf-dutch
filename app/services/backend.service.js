(function() {
    'use strict'

    class BackendService {

        static get $inject() {
            return ['$http']
        }

        constructor($http) {
            this.$http = $http
        }

        getFileEntries() {
            return this.$http({
                url: '/file',
                method: 'GET',
                cache: true
            }).then(resp => resp.data.files)
                .catch(err => this.handleFailure(err, this.getFileEntries));
        }

        getFile(fileName) {
            return this.$http({
                url: '/file/' + fileName,
                method: 'GET',
                cache: true
            }).then(resp => resp.data.content)
                .catch(err => this.handleFailure(err, this.getFile));
        }

        handleFailure(e, caller) {
            let newMessage = 'XHR Failed for ' + caller.name;
            if (e.data && e.data.description) {
                newMessage = newMessage + '\n' + e.data.description;
            }
            e.data.description = newMessage;
            this.$log.error(newMessage);
            return this.$q.reject(e);
        }
    }

    angular.module('app')
        .service('backendService', BackendService);
}())
