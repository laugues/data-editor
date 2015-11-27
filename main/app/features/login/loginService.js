'use strict';


angular.module('MLEditor')
    .factory('LoginService', [
        '$rootScope',
        'globalConstants',
        'RequestService',

        function ($rootScope, globalConstants, RequestService) {

            var LoginService = {
                connect: _connect,
                logout: _logout
            };

            function _connect() {
                var _url = RequestService.buildServiceUrl(globalConstants.LOGIN_PATH);
                return RequestService.doGet(_url, {});
            }

            function _logout() {
                $rootScope.basicAuthenticationValue = null;
                $rootScope.isAuthenticated = false;
                $rootScope.loginFailed = false;
            }


            return LoginService;
        }
    ]);