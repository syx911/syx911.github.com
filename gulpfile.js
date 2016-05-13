var path = require('path');
var fs = require('fs');


var gulp = require('gulp');
var plugins = require('gulp-load-plugins');
var requireDir = require('require-dir');

plugins.sequence = require('run-sequence');
plugins.browserify = require('browserify');
plugins.source = require('vinyl-source-stream');
plugins.buffer = require('vinyl-buffer');
plugins.scss = require('gulp-sass');
plugins.rename = require('gulp-rename');
plugins.cleanCss = require('gulp-clean-css');
plugins.uglify = require('gulp-uglify');
plugins.replace = require('gulp-replace');

var conf = {};

(function () {
    var confs = requireDir('tasks/conf');
    for (var key in confs) {
        confs[key](conf);
    }
})();

(function () {
    var build = requireDir('tasks/build');
    for (var key in build) {
        build[key](gulp, plugins, conf);
    }
})();

(function(){
    var build = requireDir('tasks/publish');
    for (var key in build) {
        build[key](gulp, plugins, conf);
    }
})();


//
//readFile('tasks/conf', function (path) {
//    require(path)(conf);
//});
//
//readFile('tasks/build', function (path) {
//    require(path)(gulp, plugins, conf);
//});
//
//console.log(conf);


//
//var conf = {};
//
//plugins.browserify = require('browserify');
//plugins.scss = require('gulp-sass');
//plugins.buffer = require('vinyl-buffer');
//plugins.source = require('vinyl-source-stream');
//plugins.sequence = require('run-sequence');
//
//var taskfiles = [
//    './tasks/build'/*,
//    './tasks/publish'*/
//];
//
//invokeConfig(loadTasks('./tasks/conf'));
//for (var i in taskfiles) {
//    invokeTasks(loadTasks(taskfiles[i]));
//}
//
//function loadTasks(relPath) {
//    return includeAll({
//            dirname: path.resolve(__dirname, relPath),
//            filter: /(.+)\.js$/
//        }) || {};
//}
//
//function invokeTasks(tasks) {
//    for (var taskName in tasks) {
//        if (tasks.hasOwnProperty(taskName)) {
//            tasks[taskName](gulp, plugins, conf);
//        }
//    }
//}
//function invokeConfig(tasks) {
//    for (var taskName in tasks) {
//        if (tasks.hasOwnProperty(taskName)) {
//            conf = tasks[taskName](conf);
//        }
//    }
//}