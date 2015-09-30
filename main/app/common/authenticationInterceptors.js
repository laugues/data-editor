'use strict';

var authenticationInterceptors = angular.module('authenticationInterceptors', []);

authenticationInterceptors.factory('AuthInterceptor', ['$rootScope', '$q',  '$location',
    function ($rootScope, $q,  $location) {
        var AuthInterceptor = {
            request: function (config) {
                if (typeof $rootScope.basicAuthenticationValue == 'undefined' || $rootScope.basicAuthenticationValue == null || $rootScope.basicAuthenticationValue == ''
                    || typeof $rootScope.isAuthenticated == 'undefined' || !$rootScope.isAuthenticated) {
                    $location.path('/login');
                }

                return config;
            },
            response: function (response) {
                return response;
            }
        };
        return AuthInterceptor;
    }]);


authenticationInterceptors.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]);