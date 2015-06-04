'use strict';

var gulp = require('gulp');
var watchify = require('watchify');
var gutil = require('gulp-util');

//server and autoreload
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//javascript bundle
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var assign = require('lodash').assign;

//test
var karma = require('karma').server;

//paths
var testPath = 'test/**/**.js';
var binPath = './bin';
var mainJS = 'VPAIDHTML5Client.js';

var jsBuild = watchify(
    browserify(
        assign(
            {},
            watchify.args,
            {
                entries: ['./js/' + mainJS],
                debug: true
            }
        )
    )
);

jsBuild.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return jsBuild.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(source(mainJS))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(binPath))
        .pipe(reload({stream: true, once: true}));
}

gulp.task('browserify', bundle);

gulp.task('test:ci', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['Firefox']
    }, done);
});

gulp.task('test:dev', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, function () {
        done();
    });
});

//watch file changes
gulp.task('watch:demo', function() {
    jsBuild.on('update', bundle);
    gulp.watch(['demo/*.html', 'demo/*.css'], reload);
    gulp.watch([binPath + '/*.js'], ['test:dev'], reload);
    gulp.watch([testPath], ['test:dev']);
});

//watch file changes
gulp.task('watch:test', function() {
    jsBuild.on('update', bundle);
    gulp.watch([binPath + '/*.js'], ['test:dev']);
    gulp.watch([testPath], ['test:dev']);
});


//create the static server
gulp.task('serve', ['browserify', 'watch:demo'], function () {
    browserSync({
        server: {
            baseDir: ['demo', binPath]
        }
    });
});

gulp.task('default', ['test:dev', 'browserify', 'watch:test']);

