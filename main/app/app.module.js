'use strict';

/* App Module */

var itesoftMlEditor = angular.module('itesoft-ml-editor', [
    'itesoft',
    'ngRoute',
    'ui.codemirror',
    //'xml',
    'pascalprecht.translate',
    'base64',
    'authenticationInterceptors',
    'invoiceSearchControllers',
    'loginControllers'
])



itesoftMlEditor.run(['$http','$translate', function ($httpProvider, $translate) {
    $httpProvider.defaults.headers.common['Authorization'] = "";
    $translate.refresh();
    $translate.use('fr');
}]);
