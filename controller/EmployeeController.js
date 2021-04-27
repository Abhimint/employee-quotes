const mongoose = require('mongoose');
const https = require('https');
const fetch = require('node-fetch');
const { locals } = require('..');
const Employee = mongoose.model('Employee');

const QUOTE_URL = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
const JOKE_URL = 'https://icanhazdadjoke.com/';
var swansonQuote = '';
var joke = '';

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
        swansonQuote: swansonQuote, 
        joke: joke 
    });
}

// Save new employee (POST)
employeeController.save = (req, res) => {
    var employee = new Employee(req.body);

    employee.save((err) => {
        console.log('.save favouriteJoke', req.body.favouriteJoke);
        // swansonQuote = swansonQuote();
        console.log('This is the swansonQuote var', swansonQuote);
        // alert(fetchQuote);
        if (err) {
            console.error('Error saving employee, redirecting back to create page', err);
            res.render('../views/employees/create');
        } else {
            console.log('Successfully saved employee details');
            res.redirect('/employees/show/' + employee._id);
        }
    });
}

// Edit employee by :id  -- redirects to edit page
employeeController.edit = (req, res) => {
    Employee.findOne({_id: req.params.id}).exec((err, employee) => {
        if (err) {
            console.error('Error editing the specific employee', err);
        } else {
            // Redirect to the edit page
            res.render('../views/employees/edit', { employee: employee });
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

// employeeController.fetchAndAttributeQuote = (req, res) => {
//     Employee.
// }

// Fetch Ron Swanson Quote
// var fetchQuote = async () => {
//     await https.get(QUOTE_URL, res => {
//         res.setEncoding('utf8');
//         let quote = "";
//         res.on('data', data => {
//           quote += data;
//         });
//         res.on('end', async () => {
//           quote = JSON.parse(quote[0]);
//           swansonQuote = quote[0];
//           return await swansonQuote;
//         })
//     });
// }

// swansonQuote = (async () => {
//     await https.get(QUOTE_URL, res => {
//         res.setEncoding('utf8');
//         let quote = "";
//         res.on('data', data => {
//           return quote += data;
//         });
//         res.on('end', async () => {
//           quote = await JSON.parse(quote[0]);
//         //   swansonQuote = quote[0];
//         console.log('Inside the IIFE ', quote[0]);
//           return quote[0];
//         })
//     });
// })();

fetch(QUOTE_URL)
    .then(res => res.json())
    .then(json => {
        // console.log('node-fetch swanson', json)
        swansonQuote = json[0];
        // console.log('Now swasonquote is ', swansonQuote);
        return encodeURIComponent(swansonQuote);
    });

fetch (JOKE_URL, {
    method: 'GET',
    headers: { 
        'Accept': 'application/json', 
        'User-Agent': 'testApplication (https://github.com/Abhimint/employee-quotes)'
    },
    })
    .then(res => res.json())
    .then(json => {
        joke = json.joke
        console.log('Joke now', encodeURI(joke));
        return encodeURIComponent(joke.valueOf());
    })

module.exports = employeeController;