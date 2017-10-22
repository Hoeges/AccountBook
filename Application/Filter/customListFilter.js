'use strict';

angular.module('app.filter.customListFilter', [])

    .filter('customListFilter', ['$translate', '$filter', function ($translate, $filter) {

        return function (items, filterValue) {

            if (!items || !items.length || !angular.isDefined(filterValue)) {
                return items;
            }

            return items.filter(function (item) {

                if (item.doc.bookingDate && $filter('date')(item.doc.bookingDate, 'dd.MM.yyyy').indexOf(filterValue) >= 0) {
                    return true;
                }

                if (item.doc.user && item.doc.user.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) {
                    return true;
                }

                if (item.doc.title && item.doc.title.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) {
                    return true;
                }

                if (item.doc.description && item.doc.description.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) {
                    return true;
                }

                if (item.doc.amount && $filter('currency')(item.doc.amount, '€ ', 2).indexOf(filterValue) >= 0) {
                    return true;
                }

                if (item.doc.recordType && $translate.instant('BOOKING_TYPE_' + item.doc.recordType).toLowerCase().indexOf(filterValue.toLowerCase()) >= 0) {
                    return true;
                }

                return false;

            });

        };

    }]);