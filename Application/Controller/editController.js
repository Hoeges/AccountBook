'use strict';

angular.module('app.controller.edit', ['ngRoute'])

    .controller('editController', ['$scope', '$rootScope', '$route', '$mdDialog', 'notificationService', 'dataService', 'masterDataService', 'config', 'record',
        function ($scope, $rootScope, $route, $mdDialog, notificationService, dataService, masterDataService, config, record) {

            // Initialize record object
            $scope.record = record.doc;
            $scope.record.bookingDate = new Date($scope.record.bookingDate);

            // Initialize master data
            if ($scope.record.incomeExpense === 'I') {
                $scope.types = masterDataService.incomeTypes();
            }

            if ($scope.record.incomeExpense === 'E') {
                $scope.types = masterDataService.expenseTypes();
            }

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
             * This function submits the form and tries to update the record.
             */
            $scope.processForm = function () {

                if ($scope.recordForm.$valid) {

                    $rootScope.$broadcast(config.Event.LoadingStarted);

                    dataService.update($scope.record).success(function (data) {

                        if (data && data.ok) {
                            notificationService.showToast('UPDATE_ENTRY_SUCCESS', 'success-toast');
                        } else {
                            notificationService.showToast('UPDATE_ENTRY_ERROR', 'error-toast');
                        }

                        $mdDialog.hide();

                        $route.reload();

                    }).catch(function (err) {

                        notificationService.showToast('UPDATE_ENTRY_ERROR', 'error-toast');

                        $rootScope.$broadcast(config.Event.LoadingFinished);

                        $mdDialog.hide();

                    });

                }

            };

            /**
             * This function closes the edit dialog.
             */
            $scope.close = function () {
                $mdDialog.cancel();
            };

        }]);