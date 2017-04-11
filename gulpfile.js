/**
 * Created by serj2 on 11.04.2017.
 */
'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer');
const del = require('del');
const run = require('run-sequence');
const server = require('browser-sync').create();

gulp.task('assets', function () {
  return gulp.src([
    'frontend/fonts/**/*.{woff,woff2}',
    'frontend/img/**',
    'frontend/js/**',
    'frontend/*.html'
  ], {base: 'frontend'})
    .pipe(newer('build'))
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build',  function (fn) {
  run(
    'clean',
    'assets',
    fn
  );
});

gulp.task('serve', function () {
  server.init({
    server: 'build'
  });

  gulp.watch('frontend/**', ['assets']);
  server.watch('build/**/*.*').on('change', server.reload);
});
