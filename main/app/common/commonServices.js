'use strict';

angular.module('MLEditor')
    .factory('CommonService', [
        'globalConstants',
        'itPopup',
        '$rootScope',
        '$window',
        '$location',
        '$translate',
        function (globalConstants, itPopup, $rootScope,$window, $location, $translate) {

            var CommonService = {
                showAlertPopup: _showAlertPopup,
                showErrorAlertPopup: _showErrorAlertPopup,
                showSuccessAlertPopup: _showSuccessAlertPopup,
                getRootUrl: _getRootUrl,
                initRootUrl: _initRootUrl,
                saveRootUrl: _saveRootUrl,
                resizeEvent: _resizeEvent
            };

            var CACHED_ROOT_URL_KEY = 'doc_editor_root_url_key';
            var _ERROR_TYPE = 'error';
            var _SUCCESS_TYPE = 'success';

            /**
             * Show a popup with title and message. Style of title depends on the type of alert
             * @param titleKey translation key for popup alert
             * @param message the translated message
             * @param type the type of alert ('info', 'error', 'warning')
             * @private
             */
            function _showAlertPopup(titleKey, message, type) {

                var title = '';
                if (type == '' || type == 'info') {
                    title = $translate.instant(titleKey);
                } else {
                    var className = 'alert-popup-' + type;
                    title = '<span class="' + className + '"> ' + $translate.instant(titleKey) + '</span>';
                }

                var alertPopup = itPopup.alert({
                    title: title,
                    text: message
                });
            };

            function _showErrorAlertPopup(titleKey, message) {
                _showAlertPopup(titleKey, message, _ERROR_TYPE);
            };

            function _showSuccessAlertPopup(titleKey, message) {
                _showAlertPopup(titleKey, message, _SUCCESS_TYPE);
            };


            function _getRootUrl() {
                return localStorage.getItem(CACHED_ROOT_URL_KEY);
            };

            function _initRootUrl() {
                var cachedRootURL = _getRootUrl();
                if (cachedRootURL == null || cachedRootURL == '') {
                    var url = $location.protocol() + "://" + $location.host() + ":" + $location.port();
                    _saveRootUrl(url);
                }
            };

            function _saveRootUrl(url) {
                if (url != null || url != '') {
                    localStorage.setItem(CACHED_ROOT_URL_KEY, url);
                }
            };

            function _resizeEvent() {
                //Resize event for prevent uigrid sizing problems
                $rootScope.$applyAsync(function () {
                    var event = document.createEvent('Event');
                    event.initEvent('resize', true /*bubbles*/, true /*cancelable*/);
                    $window.dispatchEvent(event);
                    //console.log("resize event...");
                });
            }

            return CommonService;
        }
    ]);