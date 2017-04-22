/**
 * Created by serj2 on 11.04.2017.
 */
'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const del = require('del');
const run = require('run-sequence');
const server = require('browser-sync').create();

gulp.task('style', function () {
  gulp.src('frontend/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      mqpacker({sort: true}),
      autoprefixer({browsers: ['last 2 versions']})
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('images', function () {
  return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('uglify', function () {
  return gulp.src('build/js/script.js')
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('html:copy', function () {
  return gulp.src('frontend/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function (fn) {
  server.reload();
  fn();
});

gulp.task('copy', function () {
  return gulp.src([
    'frontend/fonts/**/*.{woff,woff2}',
    'frontend/img/**',
    'frontend/js/**',
    'frontend/*.html'
  ], {base: 'frontend'})
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build',  function (fn) {
  run(
    'clean',
    'copy',
    'style',
    'images',
    'uglify',
    fn
  );
});

gulp.task('serve', function () {
  server.init({
    server: 'build'
  });

  gulp.watch('frontend/**', ['style']);
  gulp.watch('frontend/*.html', ['html:update']);
});
