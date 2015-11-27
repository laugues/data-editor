module.exports = function(config){
  config.set({

    basePath : '..',

    files : [
      'main/assets/lib/angular-common/dist/assets/lib/vendor.min.js',
      'main/assets/lib/angular-common/dist/app/itesoft.min.js',
      'main/assets/lib/angular/angular.js',
      'main/assets/lib/angular-ui-codemirror/ui-codemirror.min.js',
      'main/assets/lib/angular-mocks/angular-mocks.js',
      'main/app/app.module.js',
      'main/app/app.constant.js',
      'main/app/app.route.js',
      'main/app/app.translation.js',
      'main/app/common/**/*.js',
      'main/app/features/**/*.js',
      'test/unit/features/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};