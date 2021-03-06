var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('app/assets/src/img/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
      .pipe(gulp.dest('app/dist/img/'));
});

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

gulp.task('styles', function(){
  gulp.src(['app/assets/src/scss/**/*.scss'])
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
        }}))
      .pipe(sass())
      .pipe(autoprefixer('last 2 versions'))
      .pipe(gulp.dest('app/dist/css/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('app/dist/css/'))
      .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src(['app/modules/**/*.module.js', 'app/modules/**/*.js', 'app/app.js'])
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');''
        }}))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('app/dist/js'))
      .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("app/assets/src/scss/**/*.scss", ['styles']);
  gulp.watch("app/**/*.js", ['scripts']);
  gulp.watch("app/**/*.html", ['bs-reload']);
});
