'use strict';

/* App Module */

angular.module('MLEditor', [
    'itesoft',
    'ngRoute',
    'pascalprecht.translate',
    'ui.codemirror',
    'ui.grid.infiniteScroll',
    'base64'
]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthenticationInterceptor');
}]).run(['$http', '$translate', function ($httpProvider, $translate) {
    $httpProvider.defaults.headers.common['Authorization'] = "";
    $translate.refresh();
    $translate.use('fr');
}])  .run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.pageTitle = $route.current.title;
    });
}]);

