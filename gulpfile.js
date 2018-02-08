var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var runSequence = require('run-sequence');
var uglifyjs = require('gulp-uglifyjs');
var imagemin = require('gulp-imagemin');

gulp.task('default', defaultTask);

gulp.task('style', function(){
  return gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
    	  browsers: ['last 2 version'],
    	  cascade: false
    	}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(csso())
    .pipe(rename(function(path) {
    	path.basename += '.min';
    	}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
	});

gulp.task('js', function(){
	return gulp.src('js/*.js')
	  .pipe(gulp.dest('./dist/js'))
	  .pipe(uglifyjs())
	  .pipe(rename(function(path) {
	  	path.basename += '.min';
	  	}))
	  .pipe(gulp.dest('dist/js'))
	  .pipe(browserSync.stream())
	})

gulp.task('del', function() {
	return del('./dist')
	});

gulp.task('copy', function() {
	return gulp.src(['*.html'])
	  .pipe(gulp.dest('./dist/'))
	  .pipe(browserSync.stream())
	});

gulp.task('imagemin', function(){
  return  gulp.src('./img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/img'))
	});

gulp.task('build', gulp.series(
	  'del',
	  gulp.parallel('style','copy','js','imagemin')));

gulp.task('serve', function(){
    browserSync.init({
        server: '.'
    	});

    gulp.watch("sass/**/*.scss", gulp.series('style'));
    gulp.watch("js/*.js", gulp.series('js'));
    gulp.watch("*.html").on('change', browserSync.reload);
  });

function defaultTask(done) {
  // place code for your default task here
  done();
}