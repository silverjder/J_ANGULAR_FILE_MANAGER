/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var libs = './wwwroot/assets/libs/';

gulp.task('default', function () {
    // place code for your default task here
});



gulp.task('restore:rxjs', function () { gulp.src(['node_modules/rxjs/**/*.js']).pipe(gulp.dest(libs + 'rxjs')); });
gulp.task('restore:font-awesome', function () { gulp.src(['node_modules/font-awesome/**/*.*']).pipe(gulp.dest(libs + 'font-awesome')); });
gulp.task('restore:jquery', function () { gulp.src(['node_modules/jquery/dist/**/*.*']).pipe(gulp.dest(libs + 'jquery')); });
gulp.task('restore:tether', function () { gulp.src(['node_modules/tether/dist/**/*.*']).pipe(gulp.dest(libs + 'tether')); });
gulp.task('restore:bootstrap', function () { gulp.src(['node_modules/bootstrap/dist/**/*.*']).pipe(gulp.dest(libs + 'bootstrap')); });
gulp.task('restore:primeng', function () { gulp.src(['node_modules/primeng/resources/**/*.*']).pipe(gulp.dest(libs + 'primeng')); });
 
gulp.task('restore', [
    'restore:rxjs',
    'restore:font-awesome',
    'restore:jquery',
    'restore:tether', 
    'restore:bootstrap',
    'restore:primeng'
]);
