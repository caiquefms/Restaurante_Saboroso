var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var rediStore = require("connect-redis")(session);
// A linha acima é igual a duas abaixo
// var conectaRedis = require('connect-redis');
// var rediStore = conectaRedis(session);
var formidable = require('formidable');
var path = require('path');
// var http = require('http');
// var socket = require('socket.io');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

// var http = http.Server(app);
// var io = socket(http);

// io.on('connection',function(socket){
//   console.log('Novo Usuário conectado!');
//   io.emit("reservations update",{
//     date: new Date()
//   })


// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store:new rediStore({
    host:'localhost',
    port:6379
  }),
  secret:'12345',
  resave:true,
  saveUninitialized:true
}));

app.use(function(req,res,next){

  if(req.method === "POST"){
    var form = formidable.IncomingForm({
      uploadDir:path.join(__dirname,"/public/images"),
      keepExtensions:true
    });
    form.parse(req,function(err,fields,files){
      req.body = fields;
      req.fields = fields;
      req.files = files;
      next();
    });
  }else{
    next();
  }

});



app.use(logger('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// http.listen(3000,function(){
//   console.log('servidor em execução...');
// });
module.exports = app;
