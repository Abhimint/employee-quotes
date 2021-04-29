const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { check, validationResult } = require('express-validator');

// Used for pulling vars into view 
const { locals } = require('..');

const Employee = mongoose.model('Employee');

// TODO: Shift to api endpoints 
const QUOTE_URL = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
const JOKE_URL = 'https://icanhazdadjoke.com/';
const SELF_REPO = 'https://github.com/Abhimint/employee-quotes';

// Ensure where these template vars are being rendered, those fields !disabled as ejs does not recognize the value
var swansonQuote = '';
var joke = '';

// Var gets updated on app startup, on create employee, update employee and delete employee
var ceoExists = false;

var employeeController = {};

// Show all employees (GET)
employeeController.list = (req, res) => {
    Employee.find({}).exec((err, employees) => {
        if (err) {
            console.error('Error fetching all employees', err);
        } else {
            // Render list of all fetched employees
            res.render('../views/employees/index', { employees: employees});
        }
    });
};

// Show employee with :id (GET)
employeeController.show = (req, res) => {
    Employee.findOne({_id: req.params.id}).exec((err, employee) => {
        if (err) {
            console.error('Error fetching the specific employee', err);
        } else {
            // Render employee with the specific id
            res.render('../views/employees/show', { employee: employee });
        }
    })
}

// Create employee - Redirection Action
employeeController.create = (req, res) => {
    res.render('../views/employees/create', {
        // fetched api results sent over as query params 
        swansonQuote: swansonQuote, 
        joke: joke 
    });
}

// Save new employee (POST)
employeeController.save = (req, res) => {
    var employee = new Employee(req.body);
    // const uniqueCeoError = validationResult
    employee.save((err) => {
        // Add pre-post server side logic here
        // if (doesCEOExist) {
            if (err) {
                console.error('Error saving employee, redirecting back to create page', err);
                res.render('../views/employees/create');
            } else {
                console.log('Successfully saved employee details');
                res.redirect('/employees/show/' + employee._id);
            }
        // } else {
        //     console.log('Entered else for the doesCEOExist condition');
        //     res.redirect('../views/employees/create', );
        // }
    });
}

// Edit employee by :id  -- redirects to edit page
employeeController.edit = (req, res) => {
    Employee.findOne({_id: req.params.id}).exec((err, employee) => {
        if (err) {
            console.error('Error editing the specific employee', err);
        } else {
            // Redirect to the edit page
            res.render('../views/employees/edit', { employee: employee, 
                swansonQuote: swansonQuote, 
                joke: joke 
            });
        }
    });
}

// Currently edited employee update (PUT)
employeeController.update = (req, res) => {
    Employee.findByIdAndUpdate(req.params.id, { $set: { 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        hireDate: req.body.hireDate,
        role: req.body.role,
        favouriteJoke: req.body.favouriteJoke,
        favouriteQuote: req.body.favouriteQuote }}, 
        { new: true }, 
        (err, employee) => {
            if (err) {
                console.error('Error updating employee', err);
                res.render('../views/employees/edit', { employee: req.body });
            } else {
                // Redirect to the correct resource
                console.log('Employee being saved with success and ', req.body.favouriteJoke);
                res.redirect('/employees/show/' + employee._id);
            }
        });
}

// Delete single employee by :_id (DELETE)
employeeController.delete = (req, res) => {
    Employee.remove({_id: req.params.id}, (err) => {
        if (err) {
            console.error('Error deleting employee', err);
        } else {
            console.log('Employee deleted');
            res.redirect('/employees');
        }
    });
}

// functions that get triggered on app startup + TODO: Wrap on startup code in a service
fetch(QUOTE_URL)
    .then(res => res.json())
    .then(json => {
        swansonQuote = json[0];
        return encodeURIComponent(swansonQuote);
    });

fetch (JOKE_URL, {
    method: 'GET',
    headers: { 
        'Accept': 'application/json', 
        'User-Agent': `testApplication (${SELF_REPO})`
    },
    })
    .then(res => res.json())
    .then(json => {
        joke = json.joke
        console.log('Joke now', encodeURI(joke));
        return encodeURIComponent(joke.valueOf());
    });

const doesCEOExist = Employee.find({ role: /CEO/i }).exec((err, employee) => {
    if (employee.length > 0) {
        //ceoExists = true;
        console.log('ceo exits ', employee, ceoExists);
        return true;
    } else {
        //ceoExists = false;
        console.log('ceo does not exits ', employee, ceoExists);
        return false;
    }
});

module.exports = employeeController;