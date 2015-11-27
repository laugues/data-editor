'use strict';

angular.module('MLEditor')
    .factory('AuthenticationInterceptor', [
        '$rootScope',
        '$q',
        '$location',
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