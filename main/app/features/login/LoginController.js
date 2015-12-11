'use strict';

/* Controllers */

var LoginController = angular.module('LoginController', []);
//----------------------------
//Controller for invoice
//----------------------------

LoginController.controller('LoginCtrl', ['$base64', '$scope', '$rootScope', '$location', 'LoginService',
    function ($base64, $scope, $rootScope, $location, LoginService) {

        $scope.loginFailed = false;

        $scope.login = function () {

            $rootScope.basicAuthenticationValue = _getAuthenticationExpression();

            LoginService.connect().then(function (response) {

                $scope.status = response.status;
                $rootScope.isAuthenticated = true;

                $location.path("/invoices/search");

            }, function (response) {

                $rootScope.isAuthenticated = false;
                $rootScope.loginFailed = true;

            });

        };

        function _getAuthenticationExpression() {
            $scope.basicEncrypted = $base64.encode($scope.account.user + ':' + $scope.account.password)
            return 'Basic ' + $scope.basicEncrypted;
        }
    }]);


LoginController.controller('LogoutCtrl', ['LoginService',
    function () {
        //LoginService.logout();
    }]);