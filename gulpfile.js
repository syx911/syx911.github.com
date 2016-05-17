var gulp = require('gulp');
var fs = require('fs');
var crypto = require('crypto');
var loadfiles = require('./tasks/readFiles');
var markdown = require('markdown-it')();


var rename = require('gulp-rename');

gulp.task('default', function () {
    var reg_md = new RegExp('.md$');// 验证当前文件是md文件
    var md5map = new Md5map('./pages/MD5MAP.json');
    var template = new Template('./pages/template.html');
    var page;
    loadfiles('./data', function (path) {
        if (reg_md.test(path)) {
            page = new Page(path);
            page.compress(template);
            if (!md5map.check(page.name, page.htmlContext)) {
                md5map.setMD5(page.name, page.htmlContext);
                page.write();
            }
            md5map.write();
            page.destroy();
        }
    });// 逐个进行套模板


    md5map.destroy();
    md5map = null;
    template.destroy();
    template = null;
    page = null;
});

// md5缓存文件对象
function Md5map(p) {
    var _path = p || './pages/MD5MAP.json';
    var _md5map = getMD5MAP();

    this.getMap = function () {
        return md5map;
    };
    this.setMap = function (map) {
        if (map instanceof Md5map) {
            _md5map = map.getMap();
        } else if (typeof map === 'object') {
            _md5map = map;
        }
    };
    this.getMD5 = function (key) {
        return _md5map[key] || '';
    };
    this.setMD5 = function (key, context) {
        var md5 = crypto.createHash('md5');
        _md5map[key] = md5.update(context).digest('hex');
    };
    this.read = function (path) {
        if (path && typeof path === 'string') {
            _path = path;
        }
        _md5map = getMD5MAP();
    };
    this.write = function (path) {
        if (path && typeof path === 'string') {
            _path = path;
        }
        fs.writeFile(_path, JSON.stringify(_md5map), 'utf-8', function (error) {
            if (error) {

            }
        });
    };
    this.check = function (name, context) {
        var md5 = crypto.createHash('md5');
        var hash = md5.update(context || '').digest('hex');// 获取新页面的MD5摘要信息
        return !!(_md5map[name] && _md5map[name] == hash);
    };
    this.destroy = function () {
        _path = null;
        _md5map = null;
    };
    function getMD5MAP() {
        var context;
        try {
            context = fs.readFileSync(_path, 'utf-8');
        } catch (err) {
            console.log(err);
            context = '{}';
        }
        return JSON.parse(context);
    }

}

// 模板页对象
function Template(path, charset) {
    var _path = path || './pages/template.html';
    var _charset = charset || 'utf-8';
    var _template = fs.readFileSync(_path, _charset);// 获取模板文件

    this.getTemplate = function () {
        return _template;
    };
    this.render = function (param) {
        if (param && typeof param === 'object') {
            var val = '';
            for (var key in param) {
                val = param[key];
                _template = _template.replace(new RegExp('{{' + key + '}}', 'g'), val);
            }
            return _template;
        } else {
            return '';
        }
    };
    this.write = function (template) {
        if (template instanceof Template) {
            _template = template.getTemplate();
        }
    };
    this.destroy = function () {
        _path = null;
        _charset = null;
        _template = null;
    }
}

// 页面对象
function Page(path) {
    var _path_data = './data';
    var _path_pages = './pages';
    var reg_name = new RegExp('(./data)(/.*/|/)(.*)(.md$)', 'i');//截取出文件名字
    var reg_date = new RegExp('^(.{4})(.{2})(.{2})', 'i');//拆分日期 20161001 => [2016,10,01]=
    var _path = path || '';
    var _this = this;
    var _charset = 'utf-8';

    this.name = path.match(reg_name)[3];// 获取文件名
    this.context = markdown.render(readFile());// 将文件内容通过markdown插件转换成html块
    this.htmlContext = '';

    this.compress = function (template) {
        if (template instanceof Template) {
            _this.htmlContext = template.render({
                title: getCname(_this.name),
                code: _this.context
            });
        } else {
            console.log('template error');
        }
    };


    this.write = function () {
        fs.writeFile(path.replace(_path_data, _path_pages).replace(/.md$/g, '.html'), _this.htmlContext, _charset);
    };
    this.destroy = function () {
        var _path_data = null;
        var _path_pages = null;
        var reg_name = null;
        var reg_date = null;
        var _path = null;
        var _this = null;
        var _charset = null;
    };
    function getCname(filename) {
        var name = filename.match(reg_date).slice(1);
        name = name[0] + '年' + name[1] + '月' + name[2] + '日博客';
        return name;
    }

    function readFile() {
        var file;
        try {
            file = fs.readFileSync(_path, _charset);
        } catch (e) {
            console.log(e);
            file = '';
        }
        return file;
    }
}