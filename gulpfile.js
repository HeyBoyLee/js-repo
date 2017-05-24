var gulp = require('gulp'),
  minify = require('gulp-minify'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel');

gulp.task('babel' , function(){
  gulp.src('./src/**/*.js')
    .pipe(babel({presets:['es2015']}))
    .pipe(gulp.dest('./build-js'))
});

gulp.task('uglify' , ['babel'],function(){
  gulp.src('./build-js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./bin'))
});

gulp.task('default',['babel' , 'uglify']);

