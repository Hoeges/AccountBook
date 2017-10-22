'use strict';

angular.module('app.controller.add', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'layout/add.html',
            controller: 'addController',
            resolve: {
                autoCompleteData: ['$q', 'dataService', 'masterDataService',
                    function ($q, dataService, masterDataService) {
                        var deferred = $q.defer();
                        var uniqueTitles = masterDataService.uniqueTitles();

                        if (uniqueTitles && uniqueTitles.length > 0) {

                            deferred.resolve();

                        } else {

                            dataService.titles().then(function (success) {
                                masterDataService.uniqueTitles(success.data);
                                deferred.resolve();
                            });

                        }

                        return deferred.promise;
                    }]
            }
        });
    }])

    .controller('addController', ['$scope', '$rootScope', '$route', 'notificationService', 'dataService', 'masterDataService', 'config',
        function ($scope, $rootScope, $route, notificationService, dataService, masterDataService, config) {

            // Initialize record object
            $scope.record = {};
            $scope.record.bookingDate = new Date();
            $scope.record.incomeExpense = 'E';

            // Initialize master data
            $scope.types = masterDataService.expenseTypes();
            $scope.users = masterDataService.users();
            $scope.uniqueTitles = $rootScope.isMobile ? [] : masterDataService.uniqueTitles();

            // Initialize data needed for auto complete
            $scope.titleSearchText = undefined;

            $scope.onSearchTextChanged = function () {
                $scope.record.title = $scope.titleSearchText;
            };

            $scope.onSelectedItemChanged = function () {
                if ($scope.record.title !== null && typeof $scope.record.title === 'object') {
                    $scope.record.title = $scope.record.title.key;
                }
            };

            $scope.querySearch = function (query) {
                return query ? $scope.uniqueTitles.filter(createFilterFor(query)) : $scope.uniqueTitles;
            };

            function createFilterFor(query) {
                return function filterFn(title) {
                    return title.key.toLowerCase().indexOf(query.toLowerCase()) >= 0;
                };
            }

            /**
             * This function is called when the selected value of the income / expense radio button group is changed.
             * @param incomeExpense The newly selected value of the income / expense radio button group.
             */
            $scope.incomeExpenseChanged = function (incomeExpense) {

                if (incomeExpense === 'I') {
                    $scope.record.recordType = null;
                    $scope.types = masterDataService.incomeTypes();
                }

                if (incomeExpense === 'E') {
                    $scope.record.recordType = null;
                    $scope.types = masterDataService.expenseTypes();
                }

            };

            /**
             * This function submits the form and tries to add a new record.
             */
            $scope.processForm = function () {

                if ($scope.recordForm.$valid) {

                    $rootScope.$broadcast(config.Event.LoadingStarted);

                    dataService.update($scope.record).then(function (data) {

                        if (data && data.ok) {
                            notificationService.showToast('ADD_ENTRY_SUCCESS', 'success-toast');
                        } else {
                            notificationService.showToast('ADD_ENTRY_ERROR', 'error-toast');
                        }

                        $rootScope.$broadcast(config.Event.LoadingFinished);

                        // Reload the current route to re-initialize the record form and the validation and error states
                        $route.reload();

                    }, function (err) {

                        notificationService.showToast('ADD_ENTRY_ERROR', 'error-toast');

                        $rootScope.$broadcast(config.Event.LoadingFinished);

                    });

                }

            };

        }]);