var gulp = require('./node_modules/gulp');
var config = require('./gulpConfig');
var gulpsync = require('./node_modules/gulp-sync')(gulp);//异步控制任务执行
gulp.task('build', gulpsync.sync(config), function () {
  console.log('执行完成！')
});
