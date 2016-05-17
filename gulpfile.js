var gulp = require('gulp');
var fs = require('fs');
var crypto = require('crypto');
var loadfiles = require('./tasks/readFiles');
var markdown = require('markdown-it')();


var rename = require('gulp-rename');

gulp.task('default', function () {
    var reg_md = new RegExp('.md$');// 验证当前文件是md文件
    var reg_name = new RegExp('(./data)(/.*/|/)(.*)(.md$)', 'i');//截取出文件名字
    var reg_date = new RegExp('^(.{4})(.{2})(.{2})', 'i');//拆分日期 20161001 => [2016,10,01]
    var md5 = crypto.createHash('md5');// 创建一个MD5加密对象
    var template = fs.readFileSync('./pages/template.html', 'utf-8');// 获取wen'jian
    var md5map = JSON.parse(fs.readFileSync('./pages/MD5MAP.json', 'utf-8'));
    loadfiles('./data', function (path) {
        if (reg_md.test(path)) {
            var filename = path.match(reg_name)[3];
            console.log('step1:' + filename);
            filename = filename.match(reg_date).slice(1);
            console.log('step2:' + filename);
            filename = filename[0] + '年' + filename[1] + '月' + filename[2] + '日博客';
            console.log('setp3:' + filename);
            fs.readFile(path, 'utf-8', function (error, data) {
                var context = markdown.render(data);
                context = template.replace('{{code}}', context).replace('{{title}}', filename);
                var hash = md5.update(context).digest('hex');
                if (!(md5map[filename] && md5map[filename] == hash)) {
                    fs.writeFile(path.replace('./data', './pages').replace(/.md$/g, '.html'), context, 'utf-8');
                }
            });
        }
    });
});

gulp.task('rename', function () {
    var reg = new RegExp('.*([0-9]{2}-[0-9]{2})@.{2}.png$', 'g');
    var reg_name = new RegExp('(^.*)([0-9]{2}-[0-9]{2})(@.{2})(.png$)', 'i');
    loadfiles('./images', function (path) {
        if (reg.test(path)) {
            var newname = path.match(reg_name);
            newname = 'verify-' + newname[2].replace('-', 'x') +'.png';
            gulp.src(path).pipe(rename(newname)).pipe(gulp.dest('./images'));
        }
    })
});
