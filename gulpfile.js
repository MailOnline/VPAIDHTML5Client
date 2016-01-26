'use strict';

var gulp = require('gulp');
var watchify = require('watchify');
var gutil = require('gulp-util');
var ghPages = require('gulp-gh-pages');

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
var KarmaServer = require('karma').Server;
var istanbul = require('browserify-istanbul');

//paths
var testPath = 'test/**/**.js';
var binPath = './bin';

var jsBuilds = [
    'VPAIDHTML5Client.js'
].map(function (entry, index) {

    var build = watchify(
        browserify(
            assign(
                {},
                watchify.args,
                {
                    entries: ['./js/' + entry],
                    debug: true
                }
            )
        )
    );
    var taskName = 'bundle:' + index;

    build.on('log', gutil.log); // output build logs to terminal
    gulp.task(taskName, task);

    return {js: build, task: task, taskName: taskName};

    function task() {
        return build.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify error'))
            .pipe(source(entry))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(binPath))
            .pipe(reload({stream: true, once: true}));
    }
});


function watchBundle() {
    jsBuilds.forEach(function (build) {
        build.js.on('update', build.task);
    });
}

gulp.task('browserify', jsBuilds.map(function (build) {
    return build.taskName;
}));

gulp.task('test:ci', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        reporters: ['spec', 'coverage'],
        browsers: ['Firefox'],
        browserify: {
            debug: true,
            transform: [istanbul()]
        },
        coverageReporter: {
            reporters: [
                {
                  type: 'text',
                  dir: 'coverage/',
                  file: 'coverage.txt'
                },
                {
                  type: 'html',
                  dir: 'coverage/'
                },
                {
                  type: 'lcovonly',
                  dir: 'coverage/',
                  subdir: '.'
                },
                {type: 'text-summary'}
            ]
        }
    }, function () {
        done();
    }).start();
});

gulp.task('test:deploy', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, function () {
        done();
    }).start();
});

gulp.task('test:dev', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, function () {
        done();
    }).start();
});

//watch file changes
gulp.task('watch:demo', function() {
    watchBundle();
    gulp.watch(['demo/*'], reload);
    gulp.watch([binPath + '/*.js'], ['test:dev'], reload);
    gulp.watch([testPath], ['test:dev']);
});

//watch file changes
gulp.task('watch:test', function() {
    watchBundle();
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

gulp.task('deploy:demo', ['test:deploy', 'browserify'], function() {
    return gulp.src(['demo/**/*', 'bin/*.js', 'bin/*.map']).pipe(ghPages());
});

gulp.task('default', ['test:dev', 'browserify', 'watch:test']);

