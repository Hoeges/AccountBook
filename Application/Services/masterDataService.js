'use strict';

angular.module('app.services.masterDataService', [])
    .factory('masterDataService', [function () {

        var uniqueTitles = [];

        return {

            languages: function () {
                return ['de_DE', 'en_US'];
            },

            users: function () {
                return ['Alexander', 'Verena'];
            },

            expenseTypes: function () {
                return ['L', 'F', 'S', 'M', 'K', 'H', 'U', 'T', 'V', 'C', 'N', 'I'];
            },

            incomeTypes: function () {
                return ['G', 'E'];
            },

            uniqueTitles: function(value) {
                if (angular.isDefined(value)) {
                    uniqueTitles = value;
                } else {
                    return uniqueTitles;
                }
            }

        };

    }]);