const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

var employeeController = {};

// Show all employees
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

// Show employee with :id
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

// Create new employee - redrect to page
employeeController.create = (req, res) => {
    res.render('../views/employees/create');
}

// Save new employee
employeeController.save = (req, res) => {
    var employee = new Employee(req.body);

    employee.save((err) => {
        if (err) {
            console.error('Error saving employee, redirecting back to create page', err);
            res.render('../views/employees/create');
        } else {
            console.log('Successfully saved employee details');
            res.redirect('/employees/show' + employee._id);
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

// Currently edited employee update
employeeController.update = (req, res) => {
    Employee.findByIdAndUpdate(req.params.id, { $set: { 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        hireDate: req.params.hireDate,
        role: req.body.role,
        favouriteJoke: req.body.favouriteJoke,
        favouriteQuote: req.params.favouriteQuote }}, 
        { new: true }, 
        (err, employee) => {
            if (err) {
                console.error('Error updating employee', err);
                res.render('../views/employees/edit', { employee: req.body });
            } else {
                // Redirect to the correct resource
                res.redirect('/employees/show/' + employee._id);
            }
        });
}

// Delete single employee by :_id
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

// function create(req, res, next) {
//     let employeeFirstName = req.body.firstName;
//     let employeeLastName = req.body.lastName;
//     let employeeHireDate = req.body.hireDate;
//     let employeeRole = req.body.role;
//     let employeeFavouriteJoke = req.body.favouriteJoke;
//     let employeeFavouriteQuote = req.body.favouriteQuote;

//     let employee = new Employee({
//         employeeFirstName,
//         employeeLastName,
//         employeeHireDate,
//         employeeRole,
//         employeeFavouriteJoke,
//         employeeFavouriteQuote
//     });

//     employee.save().then((data) => {
//         res.send(data);
//     });
// }

module.exports = employeeController;