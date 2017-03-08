'use strict';

angular.module('app.components.loadingIndicator', [])

    .directive('loadingIndicator', ['$rootScope', '$mdDialog', 'config',
        function ($rootScope, $mdDialog, config) {

            return {
                replace: true,
                link: function ($scope) {

                    $scope.loadingDialogIsOpen = false;

                    $rootScope.$on(config.Event.LoadingStarted, function () {
                        showLoadingIndicator();
                    });

                    $rootScope.$on(config.Event.LoadingFinished, function () {
                        hideLoadingIndicator();
                    });

                    function showLoadingIndicator() {
                        if (!$scope.loadingDialogIsOpen) {

                            $scope.loadingDialogIsOpen = true;

                            $mdDialog.show({
                                templateUrl: 'layout/loadingIndicator.html',
                                parent: angular.element(document.body)
                            });
                        }
                    }

                    function hideLoadingIndicator() {
                        $scope.loadingDialogIsOpen = false;
                        $mdDialog.hide();
                    }
                }
            };
        }]);