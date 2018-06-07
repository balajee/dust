"use strict";

var gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  rename = require('gulp-rename'),
	  sass = require('gulp-sass'),
	  maps = require('gulp-sourcemaps'),
	  del = require('del'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync').create(),
	  htmlreplace = require('gulp-html-replace'),
	  cssmin = require('gulp-cssmin');

gulp.task("minifyUiBootStrap",function() {
    return gulp.src("node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js")
        .pipe(rename('ui-bootstrap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('node_modules/angular-ui-bootstrap/dist/'));
});

gulp.task("concatBundle",['minifyUiBootStrap'], function() {
	return gulp.src([
//		'node_modules/jquery/dist/jquery.min.js',
//		'node_modules/popper.js/dist/popper.min.js',
 //       'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/angular/angular.min.js',
          'node_modules/angular-animate/angular-animate.min.js',
          'node_modules/angular-route/angular-route.min.js',
          'node_modules/angular-sanitize/angular-sanitize.min.js',
          'node_modules/angular-touch/angular-touch.min.js',
          'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.min.js'
	])
		.pipe(maps.init())
		.pipe(concat('bundle.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe(browserSync.stream());
});

gulp.task("createMain", function() {
	return gulp.src([
		'assets/js/*.js'
	])
		.pipe(maps.init())
		.pipe(concat('main.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe(browserSync.stream());
});

gulp.task("minifyScripts", ["concatBundle", "createMain"], function() {
  return gulp.src("public/javascripts/main.js")
      .pipe(rename('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('public/javascripts'));
});

gulp.task('compileSass', function() {
  return gulp.src([
      "node_modules/bootstrap/scss/bootstrap.scss"
    ])
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('bundle.css'))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src("public/stylesheets/bundle.css")
    .pipe(cssmin())
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watchFiles', function() {
  gulp.watch('assets/css/**/*.css', ['compileSass']);
  gulp.watch('assets/js/*.js', ['createMain']);
})

gulp.task('clean', function() {
  del(['public/stylesheets/*.css', 'public/javascripts/*.js']);
});
/*
gulp.task('renameSources', function() {
  return gulp.src(['*.html', '*.php'])
    .pipe(htmlreplace({
      'js': 'assets/js/main.min.js',
      'css': 'assets/css/main.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});
*/
gulp.task("build", ['minifyScripts', 'minifyCss'], function() {
  return gulp.src([
		'*.html',
		'*.php',
		'favicon.ico',
		"assets/img/**"
	], { base: './'})
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
  browserSync.init({
  	server: "./"
  });

  gulp.watch("assets/css/**/*.scss", ['watchFiles']);
  gulp.watch(['*.html', '*.php']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function() {
  // gulp.start('renameSources');
});