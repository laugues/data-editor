/**
 * Les dépendences du builder
 */
var pkg = require('./package.json');
var gulp = require('gulp');
//var gutil = require('gulp-util');
//var bower = require('bower');
////var concat = require('gulp-concat');
////var sass = require('gulp-sass');
//var minifyCss = require('gulp-minify-css');
//var rename = require('gulp-rename');
//var uglify = require('gulp-uglify');
//var footer = require('gulp-footer');
//var header = require('gulp-header');
//var ghPages = require('gulp-gh-pages');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var buildConfig = require('./build.config.js');
//var gulpDocs = require('gulp-ngdocs');
//var less = require('gulp-less');
//var flatten = require('gulp-flatten');
//var sh = require('shelljs');
//var useref = require('gulp-useref');
//var gulpif = require('gulp-if');

/**
 * Execute les actions de build dans l'ordre
 */
gulp.task('build', function(callback) {
    runSequence('clean','html','assets');
});


/**
 *
 * Supression des fichiers du precedent build
 *
 */
gulp.task('clean', function () {
    return gulp.src(['dist/assets','dist/app','docs'],
        {force: true})
        .pipe(clean());
});


/**
 * Déplace les fichier html de l'application
 *
 */
gulp.task('html', function() {
    gulp.src('./main/app/**/*.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/app'));
});

/**
 * copie des resources present dans assets autre que Javascrip (sera minifié et concaténé)
 */
gulp.task('assets', function() {
    gulp.src(buildConfig.assetsDistFiles)
        // And put it in the dist folder
        .pipe(gulp.dest('dist/assets'));
});





