/* -------------------------------
   General
---------------------------------- */

/* Include Gulp */

var gulp = require('gulp');

/* Include Plugins */

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var cleanCSS = require('gulp-clean-css');
var imageop = require('gulp-image-optimization');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

/* Clean */

gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
});


/* -------------------------------
   Preprocessors plugins
---------------------------------- */

/* SASS */

gulp.task('sass', function() {
  return gulp.src('dev/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dev/css'));
});


/* -------------------------------
   Optimalization plugins
---------------------------------- */


/* Concatenate & Minify Javascript */

gulp.task('scripts', function() {
  return gulp.src(
    [
      'dev/js/jquery-3.3.1.min.js',
      'dev/js/main.js',
    ]
  )
  .pipe(concat('build.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(filesize())
  .pipe(rename('build.min.js'))
  .pipe(uglify())
  .on('error', function (err) { console.log( err ) })
  .pipe(gulp.dest('dist/js'))
  .pipe(filesize());
});

/* Minify CSS */

gulp.task('clean-css', function() {
  return gulp.src(
    [
      'dev/css/**/*.css'
    ]
  )
	.pipe(concat('build.css'), {rebaseUrls:false})
  .pipe(gulp.dest('dist/css'))
  .pipe(filesize())
  .pipe(rename('build.min.css'))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('dist/css'))
  .pipe(filesize())
  .pipe(sourcemaps.init())
  .pipe(postcss([ autoprefixer('last 2 versions')]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/css/'));
});

/* CSS to SASS and minify CSS */

gulp.task('styles', ['sass'], function() {
  gulp.start('clean-css');
});

/* Copy fonts */

gulp.task('copy-fonts', function() {
  return gulp.src(
    [
      'dev/fonts/**/*'
    ]
  )
  .pipe(gulp.dest('dist/fonts'))
})

/* Copy images */

gulp.task('copy-img', function() {
  return gulp.src(
    [
      'dev/img/**/*'
    ]
  )
  .pipe(gulp.dest('dist/img'))
})


/* -------------------------------
   Other plugins
---------------------------------- */

/* Watch files for changes */

gulp.task('watch', function() {
  gulp.watch('dev/js/**/*.js', ['scripts']);
  gulp.watch('dev/css/**/*.css', ['clean-css']);
  gulp.watch('dev/scss/**/*.scss', ['styles']);
  gulp.watch('dev/fonts/**/*', ['copy-fonts']);
  gulp.watch('dev/img/**/*', ['copy-img']);
});

/* Default tasks */

gulp.task('default', ['clean', 'styles', 'scripts', 'copy-fonts', 'copy-img', 'watch']);

/* FTP Saving fix */

(function ftp_debounce_fix(){
  var watch = gulp.watch;
  gulp.watch = function(glob, opt, fn){
    var _this = this, _fn, timeout;
    if ( typeof opt === 'function' || Array.isArray(opt) ) {
      fn = opt;
      opt = null;
    }
    _fn = fn;
    fn = function(){
      if( timeout ){
        clearTimeout( timeout );
      }
      timeout = setTimeout( Array.isArray(_fn) ? function(){
        _this.start.call(_this, _fn);
      } : _fn, 1150 );
    };
    return watch.call( this, glob, opt, fn );
  };
})();
