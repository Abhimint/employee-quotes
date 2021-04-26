var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Employee = require('./models/Employee');
mongoose.Promise = global.Promise;

const https = require('https');
const QUOTE_URL = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';

var app = express();

// Adding moment.js for Date formatting app wide
app.locals.moment = require('moment');

// TODO: Look into a way to add some lifecycle hooks/observables to give order to execution

const connectionString = 'mongodb+srv://employeeAdmin:SCVK1fOuPrfDUyzf@cluster0.lvbvh.mongodb.net/employee-quotes?retryWrites=true&w=majority';

mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() =>  {
    console.log('connection succesful');  
    // Initiate connection on port 3000
    app.listen(3000, () => {
        console.log('listening on port 3000');
        // Fetch Ron Swanson Quote
        https.get(QUOTE_URL, res => {
          res.setEncoding('utf8');
          let quote = "";
          res.on('data', data => {
            quote += data;
          });
          res.on('end', () => {
            quote = JSON.parse(quote);
            console.log('Ron Swanson Quote', quote);
          })
        });
    });
    }).catch((err) => console.error(err));

var index = require('./routes/index');
var employees = require('./routes/employees');

// view engine setup
app.set('views', path.resolve(path.join(__dirname, 'views')));
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