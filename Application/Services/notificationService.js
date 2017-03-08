'use strict';

angular.module('app.services.notificationService', [])
    .factory('notificationService', ['$mdToast', '$translate', function ($mdToast, $translate) {

        return {

            showToast: function (content, theme) {

                $mdToast.show(
                    $mdToast.simple()
                        .textContent($translate.instant(content))
                        .position('bottom right')
                        .hideDelay(5000)
                        .theme(theme)
                );

            }

        };

    }]);