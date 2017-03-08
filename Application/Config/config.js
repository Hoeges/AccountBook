'use strict';

angular.module('app.config', []).constant('config', {

    BaseUrl: 'http://localhost:8081/api',
    //BaseUrl: 'http://192.168.1.13:8081/api',

    Event: {
        LoadingStarted: 'app.loadingStarted',
        LoadingFinished: 'app.loadingFinished'
    }

});