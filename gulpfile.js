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
const del = require('del');
const run = require('run-sequence');
const server = require('browser-sync').create();

gulp.task('style', function () {
  gulp.src('frontend/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      mqpacker({sort: true}),
      autoprefixer(['last 2 versions'])
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
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
    fn
  );
});

gulp.task('html:copy', function () {
  return gulp.src('frontend/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function (fn) {
  server.reload();
  fn();
});

gulp.task('serve', function () {
  server.init({
    server: 'build'
  });

  gulp.watch('frontend/**', ['style']);
  gulp.watch('frontend/*.html', ['html:update']);
  server.watch('build/**/*.*').on('change', server.reload);
});
