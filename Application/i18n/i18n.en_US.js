'use strict';

angular.module('app').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en_US', {

        // Title
        APP_TITLE: 'Account Book',

        // Navigation Menu
        ADD_ENTRY: 'New',
        LIST_ENTRIES: 'List',
        STATISTICS: 'Statistic',

        // Add / Update
        TITLE: 'Title',
        BOOKING_DATE: 'Booking Date',
        DESCRIPTION: 'Description',
        AMOUNT: 'Amount',
        BOOKING_TYPE: 'Booking Type',
        INCOME: 'Income',
        EXPENSE: 'Expense',
        USER: 'User',
        ADD_ENTRY_BUTTON: 'Add Entry',
        EDIT_ENTRY_BUTTON: 'Edit Entry',
        CLOSE_BUTTON: 'Cancel',

        // Validations
        USER_REQUIRED: 'Please select a user.',
        TITLE_REQUIRED: 'Please enter a title.',
        TITLE_MAX_LENGTH: 'Please enter maximum 100 chars.',
        BOOKING_DATE_REQUIRED: 'Please enter a booking date.',
        DESCRIPTION_MAX_LENGTH: 'Please enter maximum 250 chars.',
        AMOUNT_REQUIRED: 'Please enter an amount.',
        AMOUNT_MIN: 'Please enter an amount greater than 0.',
        AMOUNT_MAX: 'Please enter an amount less than 10000.',
        AMOUNT_PATTERN: 'Please enter maximum two decimal places.',
        BOOKING_TYPE_REQUIRED: 'Please enter a booking type.',

        // Toasts
        ADD_ENTRY_SUCCESS: 'The entry was created successfully.',
        ADD_ENTRY_ERROR: 'The entry could not be created.',
        UPDATE_ENTRY_SUCCESS: 'The entry was updates successfully.',
        UPDATE_ENTRY_ERROR: 'The entry could not be updated.',
        LIST_ENTRIES_ERROR: 'The entries could not be loaded.',
        DELETE_ENTRY_SUCCESS: 'The selected entries were deleted successfully.',
        DELETE_ENTRY_ERROR: 'The selected entries could not be deleted.',
        LOAD_STATISTICS_ERROR: 'The statistics could not be loaded.',

        // Master Data --> Booking Types
        BOOKING_TYPE_L: 'Groceries',
        BOOKING_TYPE_F: 'Fixed Costs',
        BOOKING_TYPE_S: 'Other Costs',
        BOOKING_TYPE_M: 'Mobility',
        BOOKING_TYPE_K: 'Clothing',
        BOOKING_TYPE_H: 'Household',
        BOOKING_TYPE_U: 'Vacation',
        BOOKING_TYPE_T: 'Pets',
        BOOKING_TYPE_V: 'Insurances',
        BOOKING_TYPE_C: 'Checks',
        BOOKING_TYPE_N: 'Offspring',
        BOOKING_TYPE_I: 'Maintenance',
        BOOKING_TYPE_G: 'Salary',
        BOOKING_TYPE_E: 'Other Incomes',

        // Master Data --> Language
        LANGUAGE_de_DE: 'German',
        LANGUAGE_en_US: 'English',

        // Table
        SEARCH: 'Search in all fields ...',
        ROWS_PER_PAGE: 'Rows per Page',
        TABLE_TITLE: 'Entries for {{month}} {{year}}',
        ACTION_COLUMN: 'Action',

        // Statistics
        INCOMES: 'Incomes',
        EXPENSES: 'Expenses',
        SUM_INCOMES: 'Sum Incomes',
        SUM_EXPENSES: 'Sum Expenses',
        DIFFERENCE_AMOUNT: 'Differential Amount',
        ALL_USERS: 'Both',
        STATISTIC_MONTH: 'Monthly Statistics',
        STATISTIC_YEAR: 'Yearly Statistics',
        STATISTIC_MONTH_TABLE_TITLE: 'Monthly Statistic for {{month}} {{year}}',
        STATISTIC_YEAR_TABLE_TITLE: 'Yearly Statistic for {{year}}',

        // Delete Confirmation Dialog
        DELETE_DIALOG_TITLE: 'Delete Entry',
        DELETE_DIALOG_CONTENT: 'Do you really want to delete the selected entry?',
        DELETE_DIALOG_YES: 'Delete',
        DELETE_DIALOG_NO: 'Cancel',

        // Filter Settings
        FILTER_SETTINGS: 'Filter Settings',

        // Swipe Menu
        CANCEL_BUTTON: 'Cancel'

    });
}]);