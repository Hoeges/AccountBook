'use strict';

angular.module('app').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('de_DE', {

        // Title
        APP_TITLE: 'Haushaltsbuch',

        // Navigation Menu
        ADD_ENTRY: 'Neu',
        LIST_ENTRIES: 'Liste',
        STATISTICS: 'Statistik',

        // Add / Update
        TITLE: 'Titel',
        BOOKING_DATE: 'Buchungsdatum',
        DESCRIPTION: 'Beschreibung',
        AMOUNT: 'Betrag',
        BOOKING_TYPE: 'Buchungstyp',
        INCOME: 'Einnahme',
        EXPENSE: 'Ausgabe',
        USER: 'Person',
        ADD_ENTRY_BUTTON: 'Eintrag erstellen',
        EDIT_ENTRY_BUTTON: 'Eintrag aktualisieren',
        CLOSE_BUTTON: 'Abbrechen',

        // Validations
        USER_REQUIRED: 'Bitte eine Person auswählen.',
        TITLE_REQUIRED: 'Bitte einen Titel eingeben.',
        TITLE_MAX_LENGTH: 'Bitte maximal 100 Zeichen eingeben.',
        BOOKING_DATE_REQUIRED: 'Bitte ein Buchungsdatum eingeben.',
        DESCRIPTION_MAX_LENGTH: 'Bitte maximal 250 Zeichen eingeben.',
        AMOUNT_REQUIRED: 'Bitte einen Betrag eingeben.',
        AMOUNT_MIN: 'Bitte einen Betrag größer 0 eingeben.',
        AMOUNT_MAX: 'Bitte einen Betrag kleiner als 10000 eingeben.',
        AMOUNT_PATTERN: 'Bitte maximal zwei Kommastellen eingeben.',
        BOOKING_TYPE_REQUIRED: 'Bitte einen Buchungstyp angeben.',

        // Toasts
        ADD_ENTRY_SUCCESS: 'Der Eintrag wurde erfolgreich erstellt.',
        ADD_ENTRY_ERROR: 'Der Eintrag konnte nicht erstellt werden.',
        UPDATE_ENTRY_SUCCESS: 'Der Eintrag wurde erfolgreich aktualisiert.',
        UPDATE_ENTRY_ERROR: 'Der Eintrag konnte nicht aktualisiert werden.',
        LIST_ENTRIES_ERROR: 'Die Einträge konnten nicht geladen werden.',
        DELETE_ENTRY_SUCCESS: 'Die gewählten Einträge wurden erfolgreich gelöscht.',
        DELETE_ENTRY_ERROR: 'Die gewählten Einträge konnten nicht gelöscht werden.',
        LOAD_STATISTICS_ERROR: 'Die Statistiken konnten nicht geladen werden.',

        // Master Data --> Booking Types
        BOOKING_TYPE_L: 'Lebensmittel',
        BOOKING_TYPE_F: 'Fixkosten',
        BOOKING_TYPE_S: 'Sonderausgaben',
        BOOKING_TYPE_M: 'Mobilität',
        BOOKING_TYPE_K: 'Kleidung',
        BOOKING_TYPE_H: 'Haushalt',
        BOOKING_TYPE_U: 'Urlaub',
        BOOKING_TYPE_T: 'Tiere',
        BOOKING_TYPE_V: 'Versicherungen',
        BOOKING_TYPE_C: 'Checks',
        BOOKING_TYPE_N: 'Nachwuchs',
        BOOKING_TYPE_I: 'Instandhaltungen',
        BOOKING_TYPE_G: 'Gehalt',
        BOOKING_TYPE_E: 'Sonst. Einnahmen',

        // Master Data --> Language
        LANGUAGE_de_DE: 'Deutsch',
        LANGUAGE_en_US: 'Englisch',

        // Table
        SEARCH: 'Suche in allen Feldern ...',
        ROWS_PER_PAGE: 'Zeilen pro Seite',
        TABLE_TITLE: 'Einträge für {{month}} {{year}}',
        ACTION_COLUMN: 'Aktion',

        // Statistics
        INCOMES: 'Einnahmen',
        EXPENSES: 'Ausgaben',
        SUM_INCOMES: 'Summe Einnahmen',
        SUM_EXPENSES: 'Summe Ausgaben',
        DIFFERENCE_AMOUNT: 'Differenzbetrag',
        ALL_USERS: 'Gemeinsam',
        STATISTIC_MONTH: 'Monatsstatistik',
        STATISTIC_YEAR: 'Jahresstatistik',
        STATISTIC_MONTH_TABLE_TITLE: 'Monatsstatistik für {{month}} {{year}}',
        STATISTIC_YEAR_TABLE_TITLE: 'Jahresstatistik für {{year}}',
        TOOLTIP_PREVIOUS_PERIOD_AMOUNT: 'Vorgängerperiode: {{value}}',
        TOOLTIP_PREVIOUS_PERIOD_DIFFERENCE: 'Differenz: {{value}}',

        // Delete Confirmation Dialog
        DELETE_DIALOG_TITLE: 'Eintrag löschen',
        DELETE_DIALOG_CONTENT: 'Wollen Sie den gewählten Eintrag wirklich löschen?',
        DELETE_DIALOG_YES: 'Löschen',
        DELETE_DIALOG_NO: 'Abbrechen',

        // Filter Settings
        FILTER_SETTINGS: 'Filtereinstellungen',

        // Swipe Menu
        CANCEL_BUTTON: 'Abbrechen',

        // Auto Complete
        AUTO_COMPLETE_RESULTS: '(Ergebnisse: {{count}})'

    });
}]);