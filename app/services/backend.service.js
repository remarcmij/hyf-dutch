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
                url: '/files',
                method: 'GET',
                cache: true
            }).then(resp => resp.data.files)
                .catch(err => this.handleFailure(err, this.getAllPeople));
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

    angular.module('myAppp')
        .service('backendService', BackendService);
}())
