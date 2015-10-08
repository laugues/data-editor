'use strict';

angular.module('MLEditor')
    .controller('MainController', [
        '$scope',
        '$translate',
        function ($scope, $translate) {

            $scope.currentLanguage = 'fr_FR';

            $scope.changeLanguage = function (language) {
                $scope.currentLanguage = language;
                $translate.use(language);
            };

        }]);