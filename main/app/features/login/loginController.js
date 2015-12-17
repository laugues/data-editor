'use strict';

angular.module('MLEditor')
    .controller('LoginController', [
        '$base64',
        '$scope',
        '$rootScope',
        '$location',
        'CommonService',
        'LoginService',
        function ($base64, $scope, $rootScope, $location, CommonService, LoginService) {

            CommonService.initRootUrl();

            $scope.account = {
                url : CommonService.getRootUrl(),
                login :'',
                password : ''
            };

            $scope.loginFailed = false;



            $scope.login = function () {
                $rootScope.basicAuthenticationValue = _encodeCredentialsAsBasic();

                CommonService.saveRootUrl($scope.account.url);

                LoginService.connect().then(function (response) {

                    $scope.status = response.status;

                    $rootScope.isAuthenticated = true;

                    $location.path("/invoices/search");

                }, function (response) {
                    $rootScope.isAuthenticated = false;

                    $scope.loginFailed = true;
                });


            };


            function _encodeCredentialsAsBasic() {
                $scope.basicEncrypted = $base64.encode($scope.account.user + ':' + $scope.account.password);
                return $scope.basicEncrypted;
            }
        }]);


angular.module('MLEditor')
    .controller('LogoutController', ['LoginService',
        function (LoginService) {
            LoginService.logout();
        }]);