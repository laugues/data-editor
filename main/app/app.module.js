'use strict';

/* App Module */

angular.module('MLEditor', [
    'itesoft',
    'ngRoute',
    'pascalprecht.translate',
    'ui.codemirror',
    'base64'
]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthenticationInterceptor');
}]).run(['$http', '$translate', function ($httpProvider, $translate) {
    $httpProvider.defaults.headers.common['Authorization'] = "";
    $translate.refresh();
    $translate.use('fr');
}]);
