var gulp = require('gulp');
var tsb = require('gulp-tsb');
var filter = require('gulp-filter');
var clean = require('gulp-clean');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

var opts = require('./src/tsconfig.json').compilerOptions;
var dest = './out';

var compilation = tsb.create(opts);


function cleanOut() {
    return gulp.src(dest, {read: false})
        .pipe(clean());
}

function copy() {
    const other = filter(file => !/\.tsx?$/.test(file.path));
    return gulp.src('./src/**')
        .pipe(other)
        .pipe(gulp.dest(dest));
}

function compile() {
    const ts_or_tsx = filter(file => /\.ts|\.tsx/.test(file.path));
    const ndts = filter(file => !/\.d\.ts/.test(file.path));
    const output = gulp.src('./src/**')
        .pipe(ts_or_tsx)
        .pipe(ndts)
        .pipe(compilation())
        .pipe(gulp.dest(dest));
    return output;
}


gulp.task('clean', cleanOut);
gulp.task('copy', ['clean'], copy);
gulp.task('compile', ['copy'], compile);
gulp.task('default', ['compile']);
