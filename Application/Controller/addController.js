'use strict';

angular.module('app.controller.add', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'layout/add.html',
            controller: 'addController'
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

                    dataService.update($scope.record).success(function (data) {

                        if (data && data.ok) {
                            notificationService.showToast('ADD_ENTRY_SUCCESS', 'success-toast');
                        } else {
                            notificationService.showToast('ADD_ENTRY_ERROR', 'error-toast');
                        }

                        $rootScope.$broadcast(config.Event.LoadingFinished);

                        // Reload the current route to re-initialize the record form and the validation and error states
                        $route.reload();

                    }).catch(function (err) {

                        notificationService.showToast('ADD_ENTRY_ERROR', 'error-toast');

                        $rootScope.$broadcast(config.Event.LoadingFinished);

                    });

                }

            };

        }]);