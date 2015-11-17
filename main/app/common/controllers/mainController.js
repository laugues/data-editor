'use strict';

angular.module('MLEditor')
    .controller('MainController', [
        '$scope',
        '$translate',
        function ($scope, $translate) {

            $scope.currentLanguage = 'fr_FR';

            $scope.editorOptions = {
                lineWrapping: true,
                lineNumbers: true,
                indentWithTabs: true,
                matchTags: {bothTags: true},
                extraKeys: {
                    "Ctrl-J": "toMatchingTag",
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                        $scope.isFullScreen = true;
                    },
                    "Esc": function (cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                        $scope.isFullScreen = false;
                    },
                    "Ctrl-Q": function (cm) {
                        cm.foldCode(cm.getCursor());
                    }
                },
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                styleActiveLine: true,
                mode: 'xml'
            };


            $scope.changeLanguage = function (language) {
                $scope.currentLanguage = language;
                $translate.use(language);
            };

        }]);