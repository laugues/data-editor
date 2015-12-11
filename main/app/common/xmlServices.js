'use strict';

angular.module('MLEditor')
    .factory('XmlService', [
        '$rootScope',
        function ($rootScope) {

            var XmlService = {
                validateXml: _validateXml
            };

            $rootScope.currentXmlDom = null;


            /**
             * Store currentXmlDom in scope
             * @param xml the xml to validate
             * @returns {boolean} true if the xml is valid. false, else
             * @private
             */
            function _validateXml(xml) {
                var oParser = new DOMParser();
                var oDOM = null;
                try {
                    oDOM = oParser.parseFromString(xml, "text/xml");
                    $rootScope.currentXmlDom = oDOM;
                } catch (e) {
                    console.error("Xml is not valid : ", e.message);
                    return false;
                }
                return true;
            };

            return XmlService;
        }
    ]);