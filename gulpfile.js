var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

var paths = {
  scripts: ['./assets/js/zepto.js', './assets/js/modernizr.custom.js', './assets/js/pagetransitions.js'],
  css:     './assets/css/*.css',
}

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
      .pipe(uglify())
      .pipe(concat('all.min.js'))
      .pipe(gulp.dest('./build/assets/js'))
})

gulp.task('css', function() {
  gulp.src(paths.css)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./build/assets/css'))
})
