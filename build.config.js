/**
 * Configuration du projet.
 */
var pkg = require('./package.json');

module.exports = {
    dist: 'dist',
    /**
     * Header de la distribution.
     */
    banner: '/*!\n' +
    ' * Copyright 2015 itesoft.\n' +
    ' * http://itesoft.com/\n' +
    ' *\n' +
    ' * ML Editor, v<%= pkg.version %>\n' +
    ' *Itesoft ML Editor App.*/\n',

    closureStart: '(function() {\n',
    closureEnd: '\n})();',

    /**
     * Liste des fichiers JS de l'application qui seront minifier pour la prod.
     */
    appFiles: [
        '!main/app/**/*Test.js', // Exclude test files
        '!main/app/**/*.demo.js', // Exclude demo files
        'main/app/app.module.js',
        'main/app/app.constant.js',
        'main/app/app.route.js',
        'main/app/app.translation.js',
        'main/app/**/*.js'
    ],
    /**
     * Liste des librairies minifié à utiliser en prod
     */
    vendorCssFiles: [
        'main/assets/lib/codemirror/lib/codemirror.css',
        'main/assets/lib/codemirror/theme/material.css',
        'main/assets/lib/codemirror/addon/dialog/dialog.css',
        'main/assets/lib/codemirror/addon/display/fullscreen.css',
        'main/assets/lib/codemirror/addon/fold/foldgutter.css',
        'main/assets/css/css.css',
        'main/assets/lib/itesoft/fonts/main.min.css'
    ],
    assetsDistFiles: [
        '!main/assets/lib/**/*.js',
        '!main/assets/lib/**/*.html',
        '!main/assets/lib/**/*.md',
        '!main/assets/lib/**/*.txt',
        '!main/assets/lib/**/*.json',
        '!main/assets/css/**/*',
        '!main/assets/scss/**/*.scss',
        '!main/assets/scss/**/*.less',
        'main/assets/**/*'
    ],
    /**
     *
     * Fichiers de locales pour les formats, les monnaies, les jours, mois et autres.
     * A ne PAS minifier pour l'utilisation d'Angular Dynamic Locale
     *
     */
    localeJsFiles: [
        //'main/assets/lib/angular-i18n/angular-locale_fr.js',
        //'main/assets/lib/angular-i18n/angular-locale_en.js',
        //'main/assets/lib/angular-i18n/angular-locale_de.js'
    ],
    vendorJavascriptFiles: [
        'main/assets/lib/angular-common/dist/assets/lib/vendor.min.js',
        'main/assets/lib/angular-common/dist/app/itesoft.min.js',



        'main/assets/lib/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
        'main/assets/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',

        'main/assets/lib/angular-ui-codemirror/ui-codemirror.min.js',
        'main/assets/lib/codemirror/lib/codemirror.js',
        'main/assets/lib/codemirror/mode/xml/xml.js',
        'main/assets/lib/codemirror/addon/search/search.js',
        'main/assets/lib/codemirror/addon/search/searchcursor.js',
        'main/assets/lib/codemirror/addon/dialog/dialog.js',
        'main/assets/lib/codemirror/addon/fold/xml-fold.js',
        'main/assets/lib/codemirror/addon/edit/matchtags.js',
        'main/assets/lib/codemirror/addon/search/match-highlighter.js',
        'main/assets/lib/codemirror/addon/selection/active-line.js',
        'main/assets/lib/codemirror/addon/display/placeholder.js',
        'main/assets/lib/codemirror/addon/display/fullscreen.js',
        'main/assets/lib/codemirror/addon/fold/foldcode.js',
        'main/assets/lib/codemirror/addon/fold/foldgutter.js',
        'main/assets/lib/codemirror/addon/fold/brace-fold.js',
        'main/assets/lib/codemirror/addon/fold/xml-fold.js',
        'main/assets/lib/codemirror/addon/fold/markdown-fold.js',
        'main/assets/lib/codemirror/addon/fold/comment-fold.js',
        'main/assets/lib/vkBeautify-wrapper/dist/vkbeautify.0.99.00.beta.js',
        'main/assets/lib/angular-base64/angular-base64.min.js',
        'main/assets/lib/x2js/xml2json.js',
        'main/assets/lib/angular-xml/angular-xml.js'
    ]
};