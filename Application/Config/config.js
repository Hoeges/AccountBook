'use strict';

angular.module('app.config', []).constant('config', {

    // Production
    //BaseUrl: 'http://192.168.1.4:8081/api',

    // Development
    BaseUrl: 'http://localhost:8081/api',

    Event: {
        LoadingStarted: 'app.loadingStarted',
        LoadingFinished: 'app.loadingFinished'
    }

});