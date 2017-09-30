var gulp = require('./node_modules/gulp');
var rev = require('./node_modules/gulp-rev');  //加MD5后缀
var collector = require('./node_modules/gulp-rev-collector');   //路径替换
var changed = require('./node_modules/gulp-changed'); //检查是否变化过
var clean = require('./node_modules/gulp-clean'); //清除之前的文件
var exec = require('child_process').exec;
var  fs = require('fs');
var  join = require('path').join;
var _ROOT_ = __dirname  //根目录
var _SRC_ = _ROOT_ + '/alphaflowMobile/assets/';  //资源目录
var _DIST_ = _ROOT_ + '/dist/';  //输出目录
var _TEMPLATES_ = './dist/page/hbs_template/';
var _TEMPLATES_DEV_ = './svn_af_page/page/hbs_template/';
var _HBS_ = './dist/hbs/';
var _HBS_DEV_ = './dist/hbs_dev/';
var _FILE_PATH_ = {};  //匹配文件路径

//匹配js路径数组
Object.assign(_FILE_PATH_, {
    js: [
        _SRC_ + '**/*.js'
    ]
})
//匹配css路径数组
Object.assign(_FILE_PATH_, {
    css: [
        _SRC_ + '**/*.css'
    ]
})
//匹配html路径数组
Object.assign(_FILE_PATH_, {
    html: [
        _SRC_ + '**/*.html'
    ]
})
//匹配image路径数组
Object.assign(_FILE_PATH_, {
    images: [
        _SRC_ + '**/*.{jepg,jpg,gif,png}'
    ]
})

//匹配fonts路径数组
Object.assign(_FILE_PATH_, {
    fonts: [
        _SRC_ + '**/*.{eot,svg,ttf,woff,woff2}'
    ]
})
//匹配xml路径数组
Object.assign(_FILE_PATH_, {
    xml: [
        _SRC_ + 'xml/**/*.xml'
    ]
})
//匹配配置路径数组
Object.assign(_FILE_PATH_, {
    properties: [
        _SRC_ + '**/*.properties',
    ]
})

//匹配hbs路径数组
Object.assign(_FILE_PATH_, {
    hbs: [
        _SRC_ + '**/*.handlebars',
    ]
})

//匹配自定义路径数组
Object.assign(_FILE_PATH_, {
    defined: [
        _SRC_ + 'js/*.js',
        _SRC_ + 'css/*.css'
    ]
})

function findSync(startPath) {
    var result=[];
    function finder(path) {
        var files=fs.readdirSync(path);
        files.forEach(function(val,index){
            result.push(val.replace('.handlebars',''));
            // var fPath=join(path,val);
            // var stats=fs.statSync(fPath);
            // if(stats.isDirectory()) finder(fPath);
            // if(stats.isFile()) result.push(fPath);
        });

    }
    finder(startPath);
    return result;
}


/**
 * 任务列表
 */

gulp.task('changed', function () {
    gulp.src(_SRC_)
        .pipe(changed(_DIST_));
});

gulp.task('clean', function () {
    gulp.src(_DIST_)
        .pipe(clean());
})

gulp.task('js', function (cb) {
    setTimeout(function () {
        gulp.src(_FILE_PATH_.js)
            .pipe(rev())
            .pipe(gulp.dest(_DIST_))
            .pipe(rev.manifest({
                merge: true
            }))
            .pipe(gulp.dest(_DIST_ + 'rev/js'));
        cb();
    }, 1000)
})

gulp.task('css', function (cb) {
    setTimeout(function () {
        gulp.src(_FILE_PATH_.css)
            .pipe(rev())
            .pipe(gulp.dest(_DIST_))
            .pipe(rev.manifest({
                merge: true
            }))
            .pipe(gulp.dest(_DIST_ + 'rev/css'));
        cb();
    }, 1000)
})

gulp.task('images', function (cb) {
    setTimeout(function () {
        gulp.src(_FILE_PATH_.images)
            //.pipe(rev())
            .pipe(gulp.dest(_DIST_))
            // .pipe(rev.manifest({
            //     merge: true
            // }))
            // .pipe(gulp.dest(_DIST_ + 'rev/images'));
        cb();
    }, 1000)
})

gulp.task('fonts', function (cb) {
    setTimeout(function () {
        gulp.src(_FILE_PATH_.fonts)
            //.pipe(rev())
            .pipe(gulp.dest(_DIST_))
            .pipe(rev.manifest({
                merge: true
            }))
            .pipe(gulp.dest(_DIST_ + 'rev/fonts'));
        cb();
    }, 1000)
})

gulp.task('properties', function (cb) {
    setTimeout(function () {
        gulp.src(_FILE_PATH_.properties)
            //.pipe(rev())
            .pipe(gulp.dest(_DIST_))
            // .pipe(rev.manifest({
            //     merge: true
            // }))
            // .pipe(gulp.dest(_DIST_ + 'rev/properties'));
        cb();
    }, 1000)
})

gulp.task('xml', function (cb) {
    setTimeout(function () {
        gulp.src(_FILE_PATH_.xml)
            .pipe(rev())
            .pipe(gulp.dest(_DIST_+'xml'))
            .pipe(rev.manifest({
                merge: true
            }))
            .pipe(gulp.dest(_DIST_ + 'rev/xml'));
        cb();
    }, 1000)
})

gulp.task('rev-html', function () {
    gulp.src([_DIST_ + 'rev/**/*.json', _FILE_PATH_.html[0]])
        .pipe(collector({
            replaceReved: true,
            // dirReplacements: {
            //     '/css/': '/dist/css',
            //     '/js/': '/dist/js/'
            // }
        }))
        .pipe(gulp.dest(_DIST_));
})

gulp.task('rev-hbs', function () {
    gulp.src([_DIST_ + 'rev/**/*.json', _FILE_PATH_.hbs[0]])
        .pipe(collector({
            replaceReved: true,
            // dirReplacements: {
            //     '/css/': '/dist/css',
            //     '/js/': '/dist/js/'
            // }
        })).pipe(gulp.dest(_DIST_));
})

gulp.task('templates',function(cb){
    var templatesPathNames=findSync(_TEMPLATES_);
    exec('mkdir '+_HBS_);
    for(var i=0;i<templatesPathNames.length;i++){
        exec('handlebars '+_TEMPLATES_+templatesPathNames[i]+'.handlebars -f '+_HBS_+templatesPathNames[i]+'.js');
    }
  })

gulp.task('templatesDev',function(cb){
    var templatesPathNames=findSync(_TEMPLATES_DEV_);
    console.log(templatesPathNames)
    exec('mkdir '+_HBS_DEV_);
    for(var i=0;i<templatesPathNames.length;i++){
        exec('handlebars '+_TEMPLATES_DEV_+templatesPathNames[i]+'.handlebars -f '+_HBS_DEV_+templatesPathNames[i]+'.js');
    }
  })

module.exports = [
    'changed',
    'clean',
    'js',
    'css',
    'images',
    'fonts',
    'properties',
    'xml',
    'rev-hbs',
    'rev-html'
];