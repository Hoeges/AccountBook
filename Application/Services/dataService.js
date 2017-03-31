'use strict';

angular.module('app.services.dataService', [])
    .factory('dataService', ['$http', 'config',
        function ($http, config) {

            return {

                update: function (record) {
                    return $http.post(config.BaseUrl + '/update', record);
                },

                delete: function (rowId, revId) {
                    return $http.post(config.BaseUrl + '/delete', {
                        rowId: rowId,
                        revId: revId
                    });
                },

                list: function (selectedDate, selectedTimePeriod, loadDataForPreviousMonth) {
                    return $http.get(config.BaseUrl + '/list', {
                        params: {
                            date: selectedDate,
                            timePeriod: selectedTimePeriod,
                            loadDataForPreviousMonth: loadDataForPreviousMonth
                        }
                    });
                },

                titles: function () {
                    return $http.get(config.BaseUrl + '/titles');
                }

            };

        }]);