// Router helps to insert an employee record into mongo instance

const express = require('express');
var router = express.Router();
var employee = require('../controller/EmployeeController');
// const create = require('../controller/EmployeeController');
// const bodyParser = require('body-parser');

// TODO: Look up if router is only get or post? 
// Are these Rest calls or just associating to rest calls?

// router.use(bodyParser.json());
// router.post('/create', create.create);

// Fetch all employee
router.get('/', employee.list);

// Fetch single employee by :_id
router.get('/show/:id', employee.show);

// Create employee 
router.get('/create', employee.create);

// Save employee
router.post('/save', employee.save);

// Edit employee
router.get('/edit/:id', employee.edit);

// Edit updating an employee
router.post('/update/:id', employee.update);

// Delete employee
router.post('/delete/:id', employee.delete);

module.exports = router;