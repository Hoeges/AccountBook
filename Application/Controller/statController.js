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

            $scope.currentTimePeriodData = [];
            $scope.previousTimePeriodData = [];
            $scope.statistics = [];
            $scope.bookingDate = $rootScope.lastSelectedDateInStat ? $rootScope.lastSelectedDateInStat : new Date();
            $scope.timePeriod = $rootScope.lastSelectedTimePeriodInStat ? $rootScope.lastSelectedTimePeriodInStat : 'month';
            $scope.showFilterSettings = true;

            $scope.selectedBookingDateChanged = function () {
                $rootScope.lastSelectedDateInStat = $scope.bookingDate;
                loadData();
            };

            $scope.selectedTimePeriodChanged = function () {
                $rootScope.lastSelectedTimePeriodInStat = $scope.timePeriod;
                loadData();
            };

            function loadData() {

                $scope.currentTimePeriodData = [];
                $scope.previousTimePeriodData = [];
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

                var loadDataForPreviousMonth = !($rootScope.isMobile );

                // Load data for new booking date
                dataService.list($scope.bookingDate, $scope.timePeriod, loadDataForPreviousMonth).then(function (data) {

                    $scope.currentTimePeriodData = data.currentTimePeriodData;
                    $scope.previousTimePeriodData = data.previousTimePeriodData;
                    $scope.statistics = [];

                    $.each(masterDataService.users(), function (index, user) {
                        $scope.statistics.push(calculateStatistics($scope.currentTimePeriodData, $scope.previousTimePeriodData, user));
                    });

                    $scope.statistics.push(calculateStatistics($scope.currentTimePeriodData, $scope.previousTimePeriodData, 'ALL_USERS'));

                    $rootScope.$broadcast(config.Event.LoadingFinished);

                }, function (err) {

                    notificationService.showToast('LOAD_STATISTICS_ERROR', 'error-toast');

                    $rootScope.$broadcast(config.Event.LoadingFinished);

                });
            }

            function calculateStatistics(currentTimePeriodData, previousTimePeriodData, user) {

                var userStatistics = {
                    user: user,
                    currentTimePeriodIncome: 0,
                    previousTimePeriodIncome: 0,
                    incomePerType: [],
                    currentTimePeriodExpense: 0,
                    previousTimePeriodExpense: 0,
                    expensePerType: [],
                    currentTimePeriodDifference: 0,
                    currentTimePeriodDifferenceAbs: 0,
                    previousTimePeriodDifference: 0,
                    previousTimePeriodDifferenceAbs: 0,
                    showContent: true
                };

                $.each(masterDataService.incomeTypes(), function (index, incomeType) {
                    userStatistics.incomePerType.push({
                        type: incomeType,
                        currentTimePeriodAmount: 0,
                        previousTimePeriodAmount: 0
                    });
                });

                $.each(masterDataService.expenseTypes(), function (index, expenseType) {
                    userStatistics.expensePerType.push({
                        type: expenseType,
                        currentTimePeriodAmount: 0,
                        previousTimePeriodAmount: 0
                    });
                });

                // Current Time Period
                $.each(currentTimePeriodData, function (index, record) {

                    if (record.doc.user === user || user === 'ALL_USERS') {

                        if (record.doc.incomeExpense === 'I') {
                            userStatistics.currentTimePeriodIncome += record.doc.amount;

                            $.each(userStatistics.incomePerType, function (index, incomePerType) {
                                if (incomePerType.type === record.doc.recordType) {
                                    incomePerType.currentTimePeriodAmount += record.doc.amount;
                                    return true;
                                }
                            });
                        }

                        if (record.doc.incomeExpense === 'E') {
                            userStatistics.currentTimePeriodExpense += record.doc.amount;

                            $.each(userStatistics.expensePerType, function (index, expensePerType) {
                                if (expensePerType.type === record.doc.recordType) {
                                    expensePerType.currentTimePeriodAmount += record.doc.amount;
                                    return true;
                                }
                            });
                        }

                    }

                });

                // Previous Time Period
                $.each(previousTimePeriodData, function (index, record) {

                    if (record.doc.user === user || user === 'ALL_USERS') {

                        if (record.doc.incomeExpense === 'I') {
                            userStatistics.previousTimePeriodIncome += record.doc.amount;

                            $.each(userStatistics.incomePerType, function (index, incomePerType) {
                                if (incomePerType.type === record.doc.recordType) {
                                    incomePerType.previousTimePeriodAmount += record.doc.amount;
                                    return true;
                                }
                            });
                        }

                        if (record.doc.incomeExpense === 'E') {
                            userStatistics.previousTimePeriodExpense += record.doc.amount;

                            $.each(userStatistics.expensePerType, function (index, expensePerType) {
                                if (expensePerType.type === record.doc.recordType) {
                                    expensePerType.previousTimePeriodAmount += record.doc.amount;
                                    return true;
                                }
                            });
                        }

                    }

                });

                userStatistics.currentTimePeriodDifference = userStatistics.currentTimePeriodIncome - userStatistics.currentTimePeriodExpense;
                userStatistics.currentTimePeriodDifferenceAbs = Math.abs(userStatistics.currentTimePeriodDifference);
                userStatistics.previousTimePeriodDifference = userStatistics.previousTimePeriodIncome - userStatistics.previousTimePeriodExpense;
                userStatistics.previousTimePeriodDifferenceAbs = Math.abs(userStatistics.previousTimePeriodDifference);

                // Calculation of Diagrams

                //userStatistics.incomeTypesAsList = [];
                //userStatistics.expenseTypesAsList = [];
                //userStatistics.incomeAmountsAsList = [];
                //userStatistics.expenseAmountsAsList = [];

                //$.each(userStatistics.incomePerType, function (index, incomePerType) {
                //    userStatistics.incomeTypesAsList.push($translate.instant('BOOKING_TYPE_' + incomePerType.type));
                //    userStatistics.incomeAmountsAsList.push(incomePerType.amount);
                //});

                //$.each(userStatistics.expensePerType, function (index, expensePerType) {
                //    userStatistics.expenseTypesAsList.push($translate.instant('BOOKING_TYPE_' + expensePerType.type));
                //    userStatistics.expenseAmountsAsList.push(expensePerType.amount);
                //});

                return userStatistics;

            }

            loadData();

        }]);