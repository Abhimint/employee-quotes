const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const Employee = require('./models/Employee');
var employees = require('./routes/employees');

//Server
app.listen(3000,() => {
    console.log('Server is Up');
});

// any USES to be added before the CRUD ops
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/employees', employees);

// GET
app.get('/', (req,res) => {
    res.send('hello world');
});

// TODO: Figure out how db configuration is handled (permissioning...) without exposing creds
// const connectionString = 'mongodb+srv://employeeAdmin:TJ0lI4OvfOuekT9t@cluster0.lvbvh.mongodb.net/employee-quotes?retryWrites=true&w=majority';

const connectionString = 'mongodb://localhost/Employee';
// MongoDB connection
mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(client => {
    console.log('Connected to database');
    const db = client.db('employee-quotes');
    const quotesCollection = db.collection('quotes');

    // Express request handlers


}).catch(err => console.error('Database connection could not be established', err));