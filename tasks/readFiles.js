module.exports = (function () {
    var fs = require('fs');

    function readFiles(root, callback) {
        readDir(root, callback, root + '/base.js');
    }

    // 同步读取文件
    function readDir(root, callback, ignore) {
        fs.readdirSync(root).forEach(function (path) {
            // 同步读取给定的路径下所有的文件名，并且forEach遍历
            var filePath = root + "/" + path;// 用根目录加上文件名连接成完整的文件路径
            if (fs.statSync(filePath).isDirectory()) {// 同步读取给定路径文件Stats,并且判断这是不是一个文件夹
                readDir(filePath, callback, ignore);// 是文件夹则递归调用，继续读取文件
            } else if (filePath !== ignore && path !== '.DS_Store') {
                callback(filePath);// 是一个文件则调用回调函数
            }
        });
    }

    return readFiles;
})();