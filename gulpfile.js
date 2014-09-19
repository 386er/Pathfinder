/*global require*/
var gulp = require('gulp');
var browserSync = require('browser-sync');
var stylus = require('gulp-stylus');

gulp.task('move', function() {
	return gulp.src(['./src/**/*.*', '!./src/**/*.styl']).
		pipe(gulp.dest('build'));
});

gulp.task('stylus', function() {
	return gulp.src('./src/css/*.styl').
		pipe(stylus()).
		pipe(gulp.dest('build/css'));
});


gulp.task('watch', function() {
	gulp.watch('./src/**/*.*', ['move']);
	gulp.watch('./src/css/style.styl', ['stylus']);
});


gulp.task('build', ['move', 'stylus' ], function(cb) {
	cb();
});


gulp.task('browser-sync', ['watch'], function() {
	browserSync('./build/**/*.*', {
		server: {
			baseDir: './build/'
		}
	});
});

gulp.task('default', ['build', 'browser-sync']);



