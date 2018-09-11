'use strict';
// 加载依赖库
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// 加载路由控制
const index = require('./routes/index');
// 创建项目实例
const app = express();

// 定义EJS模板引擎和模板文件位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 定义icon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 匹配路径和路由
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});
// 输出模型app
module.exports = app;