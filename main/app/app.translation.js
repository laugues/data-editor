'use strict';

/* App Module */

angular.module('MLEditor').config(['$translateProvider', '$translatePartialLoaderProvider',
        function ($translateProvider, $translatePartialLoaderProvider) {

            $translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
                'en_US': 'en',
                'en_GB': 'en',
                'fr_FR': 'fr',
                'fr-CA': 'fr'
            }).determinePreferredLanguage();

            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: 'assets/locale/{lang}/{part}-{lang}.json'
            });
            $translatePartialLoaderProvider.addPart('global');

        }]);

