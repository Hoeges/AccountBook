'use strict';

angular.module('app', [

    // Vendor Modules
    'ngRoute',
    'ngMessages',
    'ngMaterial',
    'ngMdIcons',
    'mdDataTable',
    'pascalprecht.translate',

    // Config
    'app.config',

    // Views
    'app.controller.index',
    'app.controller.add',
    'app.controller.edit',
    'app.controller.list',
    'app.controller.stat',

    // Components
    'app.components.loadingIndicator',

    // Services
    'app.services.notificationService',
    'app.services.dataService',
    'app.services.masterDataService'

])

    .run(['$location', function ($location) {

        $location.path('/add');

    }])

    .config(['$locationProvider', '$routeProvider', '$translateProvider', '$mdThemingProvider', '$mdDateLocaleProvider',
        function ($locationProvider, $routeProvider, $translateProvider, $mdThemingProvider, $mdDateLocaleProvider) {

            // Enable HTML5 mode
            $locationProvider.html5Mode(true);

            // Theming
            $mdThemingProvider.theme('success-toast');
            $mdThemingProvider.theme('error-toast');

            // Angular Translate (i18n)
            $translateProvider.determinePreferredLanguage();
            $translateProvider.fallbackLanguage('de_DE');
            $translateProvider.useSanitizeValueStrategy('escape');

            // Set locale for Moment
            moment.locale('de-at');

            // Set locales for Angular Material date picker.
            // TODO: Translation
            $mdDateLocaleProvider.months = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',];
            $mdDateLocaleProvider.shortMonths = ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
            $mdDateLocaleProvider.days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
            $mdDateLocaleProvider.shortDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

            $mdDateLocaleProvider.firstDayOfWeek = 1;

            $mdDateLocaleProvider.formatDate = function (date) {
                return date ? moment(date).format('DD.MM.YYYY') : '';
            };

            $mdDateLocaleProvider.parseDate = function (dateString) {
                var m = moment(dateString, 'DD.MM.YYYY', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };

            $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
                return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
            };

            $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
                return 'Woche ' + weekNumber;
            };

            $mdDateLocaleProvider.msgCalendar = 'Kalender';
            $mdDateLocaleProvider.msgOpenCalendar = 'Kalender öffnen';

        }]);