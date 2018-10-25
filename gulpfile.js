var gulp = require('gulp');
var { series } = require('gulp');
var ts = require('gulp-typescript');
var filter = require('gulp-filter');
var clean = require('gulp-clean');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

var ts_opts = require('./src/tsconfig.json').compilerOptions;
var dest = './out';


function cleanOut() {
    return gulp.src(dest, { read: false })
        .pipe(clean());
}

function copyFiles() {
    const other = filter(file => !/\.tsx?$/.test(file.path));
    return gulp.src('./src/**')
        .pipe(other)
        .pipe(gulp.dest(dest));
}

function compileTS() {
    const ts_or_tsx = filter(file => /\.ts|\.tsx/.test(file.path));
    const no_dts = filter(file => !/\.d\.ts/.test(file.path));
    return gulp.src('./src/**')
        .pipe(ts_or_tsx)
        .pipe(no_dts)
        .pipe(ts(ts_opts))
        .on('error', () => {})
        .pipe(gulp.dest(dest));
}


exports.clean = cleanOut;
exports.copy = series(cleanOut, copyFiles);
exports.compile = series(copyFiles, compileTS);
exports.default = compileTS;
