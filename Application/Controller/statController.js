'use strict';

angular.module('app.controller.stat', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/stat', {
            templateUrl: 'layout/stat.html',
            controller: 'statController'
        });
    }])

    .controller('statController', ['$scope', '$rootScope', '$translate', 'dataService', 'masterDataService', 'notificationService', 'config',
        function ($scope, $rootScope, $translate, dataService, masterDataService, notificationService, config) {

            $scope.records = [];
            $scope.statistics = [];
            $scope.bookingDate = new Date();
            $scope.timePeriod = 'month';
            $scope.showFilterSettings = true;

            $scope.selectedBookingDateChanged = function () {
                loadData();
            };

            $scope.selectedTimePeriodChanged = function () {
                loadData();
            };

            function loadData() {

                $scope.records = [];
                $scope.statistics = [];

                $rootScope.$broadcast(config.Event.LoadingStarted);

                // Update header
                if ($scope.timePeriod === 'month') {
                    $scope.title = $translate.instant('STATISTIC_MONTH_TABLE_TITLE', {
                        month: moment($scope.bookingDate).format("MMMM"),
                        year: moment($scope.bookingDate).format("YYYY")
                    });
                }

                if ($scope.timePeriod === 'year') {
                    $scope.title = $translate.instant('STATISTIC_YEAR_TABLE_TITLE', {
                        year: moment($scope.bookingDate).format("YYYY")
                    });
                }

                // Load data for new booking date
                dataService.list($scope.bookingDate, $scope.timePeriod).success(function (data) {

                    $scope.records = data;
                    $scope.statistics = [];

                    $.each(masterDataService.users(), function (index, user) {
                        $scope.statistics.push(calculateStatistics($scope.records, user));
                    });

                    $scope.statistics.push(calculateStatistics($scope.records, 'ALL_USERS'));

                    $rootScope.$broadcast(config.Event.LoadingFinished);

                }).catch(function (err) {

                    notificationService.showToast('LOAD_STATISTICS_ERROR', 'error-toast');

                    $rootScope.$broadcast(config.Event.LoadingFinished);

                });
            }

            function calculateStatistics(records, user) {

                var userStatistics = {
                    user: user,
                    income: 0,
                    incomePerType: [],
                    expense: 0,
                    expensePerType: [],
                    difference: 0,
                    differenceAbs: 0,
                    showContent: true
                };

                $.each(masterDataService.incomeTypes(), function (index, incomeType) {
                    userStatistics.incomePerType.push({
                        type: incomeType,
                        amount: 0
                    });
                });

                $.each(masterDataService.expenseTypes(), function (index, expenseType) {
                    userStatistics.expensePerType.push({
                        type: expenseType,
                        amount: 0
                    });
                });

                $.each(records, function (index, record) {

                    if (record.doc.user === user || user === 'ALL_USERS') {

                        if (record.doc.incomeExpense === 'I') {
                            userStatistics.income += record.doc.amount;

                            $.each(userStatistics.incomePerType, function (index, incomePerType) {
                                if (incomePerType.type === record.doc.recordType) {
                                    incomePerType.amount += record.doc.amount;
                                    return true;
                                }
                            });
                        }

                        if (record.doc.incomeExpense === 'E') {
                            userStatistics.expense += record.doc.amount;

                            $.each(userStatistics.expensePerType, function (index, expensePerType) {
                                if (expensePerType.type === record.doc.recordType) {
                                    expensePerType.amount += record.doc.amount;
                                    return true;
                                }
                            });
                        }

                    }

                });

                userStatistics.difference = userStatistics.income - userStatistics.expense;
                userStatistics.differenceAbs = Math.abs(userStatistics.difference);

                return userStatistics;

            }

            loadData();

        }]);