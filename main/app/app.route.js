'use strict';

angular.module('MLEditor').config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/login', {
                    templateUrl: 'app/features/login/loginView.html',
                    controller: 'LoginController'
                }).
                when('/logout', {
                    templateUrl: 'app/features/login/loginView.html',
                    controller: 'LogoutController',
                    redirectTo: '/login'
                }).
                when('/invoices/search', {
                    templateUrl: 'app/features/invoices/search/invoice-search.html',
                    controller: 'InvoiceSearchController'
                }).
                otherwise({
                    redirectTo: '/login'
                });

        }]);