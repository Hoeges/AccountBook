'use strict';

angular.module('app.controller.index', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index.html',
            controller: 'indexController'
        });
    }])

    .controller('indexController', ['$scope', '$translate', '$route', 'masterDataService',
        function ($scope, $translate, $route, masterDataService) {

            // Set default route for navigation bar
            $scope.currentNavItem = 'add';

            // Set default language for language select
            $scope.language = 'de_DE';

            // Load available languages
            $scope.languages = masterDataService.languages();

            /**
             * This function changes the current application language and reloads the current view.
             * @param language The new application language.
             */
            $scope.changeLanguage = function (language) {
                $translate.use(language);
                $route.reload();
            };

        }]);