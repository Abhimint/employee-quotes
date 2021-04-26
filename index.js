// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const app = express();

// const Employee = require('./models/Employee');
// var employees = require('./routes/employees');

// //Server
// app.listen(3000,() => {
//     console.log('Server is Up');
// });

// // TODO: Figure out how db configuration is handled (permissioning...) without exposing creds
// const connectionString = 'mongodb+srv://employeeAdmin:TJ0lI4OvfOuekT9t@cluster0.lvbvh.mongodb.net/employee-quotes?retryWrites=true&w=majority';

// // const connectionString = 'mongodb://127.0.0.1/employee';
// // MongoDB connection
// mongoose.connect(connectionString, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// }).then(() => {
//     console.log('Connected to database');
// }).catch(err => console.error('Database connection could not be established', err));

// var db = mongoose.connection;

// // view engine setup
// app.set('view engine', 'ejs');

// // any USES to be added before the CRUD ops
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/employees', employees);

// // GET
// app.get('/', (req,res) => {
//     res.send('hello world');
// });

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Employee = require('./models/Employee');
mongoose.Promise = global.Promise;

const connectionString = 'mongodb+srv://employeeAdmin:SCVK1fOuPrfDUyzf@cluster0.lvbvh.mongodb.net/employee-quotes?retryWrites=true&w=majority';

mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() =>  {
    console.log('connection succesful');  
    // Initiate connection on port 3000
    app.listen(3000, () => {
        console.log('listening on port 3000');    
    });
    }).catch((err) => console.error(err));

var index = require('./routes/index');
var employees = require('./routes/employees');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/employees', employees);

// TODO: Build error handler
// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// TODO: Build environment files
// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;