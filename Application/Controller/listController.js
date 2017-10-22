'use strict';

angular.module('app.controller.list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'layout/list.html',
            controller: 'listController'
        });
    }])

    .controller('listController', ['$scope', '$rootScope', '$route', '$translate', '$filter', '$mdDialog', 'dataService', 'notificationService', 'config',
        function ($scope, $rootScope, $route, $translate, $filter, $mdDialog, dataService, notificationService, config) {

            $scope.records = [];
            $scope.filteredItems = [];
            $scope.filterValue = $rootScope.lastSelectedFilterValueInList ? $rootScope.lastSelectedFilterValueInList : '';
            $scope.bookingDate = $rootScope.lastSelectedDateInList ? $rootScope.lastSelectedDateInList : new Date();
            $scope.rowsPerPageTranslation = $translate.instant('ROWS_PER_PAGE');
            $scope.showFilterSettings = true;

            $scope.selectedBookingDateChanged = function () {
                $rootScope.lastSelectedDateInList = $scope.bookingDate;
                loadData();
            };

            $scope.applyFilter = function () {
                $rootScope.lastSelectedFilterValueInList = $scope.filterValue;

                // Filter the items
                $scope.filteredItems = $filter('customListFilter')($scope.records, $scope.filterValue);

                // Reset the isSwiped flag
                $.each($scope.filteredItems, function (index, filteredItem) {
                    filteredItem.isSwiped = false;
                });
            };

            $scope.editRecord = function (rowId) {

                // Fetch the current record from the table
                var currentRecord = getRecordByRowId($scope.records, rowId);
                if (!currentRecord) {
                    return;
                }

                // Store initial data from the table
                var initialData = angular.copy($scope.records);

                $mdDialog.show({
                    templateUrl: 'layout/edit.html',
                    controller: 'editController',
                    parent: angular.element(document.body),
                    locals: {
                        record: currentRecord
                    }
                }).then(function (data) {

                    // The success promise from hiding the dialog is not resolved.
                    // The edit dialog reloads the current route in order to update the data.

                }, function () {

                    // Edit dialog was cancelled so restore the initially saved data
                    $scope.records = initialData;
                    $scope.applyFilter();

                });

            };

            $scope.deleteRecord = function (rowId) {

                // Fetch the current record from the table
                var currentRecord = getRecordByRowId($scope.records, rowId);
                if (!currentRecord) {
                    return;
                }

                var confirmDialog = $mdDialog.confirm()
                    .title($translate.instant('DELETE_DIALOG_TITLE'))
                    .textContent($translate.instant('DELETE_DIALOG_CONTENT'))
                    .ariaLabel('Delete Entry')
                    .ok($translate.instant('DELETE_DIALOG_YES'))
                    .cancel($translate.instant('DELETE_DIALOG_NO'));

                $mdDialog.show(confirmDialog).then(function () {

                    dataService.delete(rowId, currentRecord.doc._rev).then(function (data) {

                        if (data && data.ok) {

                            $route.reload();

                            notificationService.showToast('DELETE_ENTRY_SUCCESS', 'success-toast');

                        } else {

                            notificationService.showToast('DELETE_ENTRY_ERROR', 'error-toast');

                        }

                    }, function (err) {

                        notificationService.showToast('DELETE_ENTRY_ERROR', 'error-toast');

                    });

                }, function () {

                    // Do nothing on cancel

                });

            };

            $scope.evaluateAmountClass = function (rowId) {

                var currentRecord = getRecordByRowId($scope.records, rowId);

                if (currentRecord && currentRecord.doc && currentRecord.doc.incomeExpense === 'I') {
                    return 'amount-income';
                }

                if (currentRecord && currentRecord.doc && currentRecord.doc.incomeExpense === 'E') {
                    return 'amount-expense';
                }

            };

            $scope.getRecordDescription = function (rowId) {
                var currentRecord = getRecordByRowId($scope.records, rowId);
                return (currentRecord && currentRecord.doc) ? currentRecord.doc.description : undefined;
            };

            $scope.onSwipe = function (record) {
                record.isSwiped = true;
            };

            function loadData() {

                // Clear the base list of records and the filtered list of records in order to prevent bugs in md-table
                $scope.records = [];
                $scope.filteredItems = [];

                $rootScope.$broadcast(config.Event.LoadingStarted);

                // Update table title
                $scope.tableTitle = $translate.instant('TABLE_TITLE', {
                    month: moment($scope.bookingDate).format("MMMM"),
                    year: moment($scope.bookingDate).format("YYYY")
                });

                // Load data for new booking date
                dataService.list($scope.bookingDate, 'month', false).then(function (data) {

                    if (data && data.data) {
                        $scope.records = data.data.currentTimePeriodData;
                        $scope.applyFilter();
                        $rootScope.$broadcast(config.Event.LoadingFinished);
                    } else {
                        notificationService.showToast('LIST_ENTRIES_ERROR', 'error-toast');
                        $rootScope.$broadcast(config.Event.LoadingFinished);
                    }

                }, function (err) {

                    notificationService.showToast('LIST_ENTRIES_ERROR', 'error-toast');
                    $rootScope.$broadcast(config.Event.LoadingFinished);

                });

            }

            function getRecordByRowId(records, rowId) {
                var currentRecord = {};

                $.each(records, function (index, record) {
                    if (record.doc._id === rowId) {
                        currentRecord = record;
                        return true;
                    }
                });

                return currentRecord;
            }

            loadData();

        }
    ]);