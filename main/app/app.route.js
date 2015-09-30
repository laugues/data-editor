'use strict';

itesoftMlEditor.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'app/features/login/login.html',
                controller: 'LoginCtrl'
            }).
            when('/logout', {
                templateUrl: 'app/features/login/login.html',
                controller: 'LogoutCtrl',
                redirectTo: '/login'
            }).
            when('/invoices/search', {
                templateUrl: 'app/features/invoices/search/invoice-search.html',
                controller: 'InvoiceSearchCtrl'
            }).
            otherwise({
                redirectTo: '/login'
            });

    }]);