'use strict';

angular.module('app.config', []).constant('config', {

    BaseUrl: 'http://192.168.1.4:8081/api',

    Event: {
        LoadingStarted: 'app.loadingStarted',
        LoadingFinished: 'app.loadingFinished'
    }

});