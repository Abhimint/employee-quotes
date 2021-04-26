var express = require('express');
var router = express.Router();

// Serve home page on entry (GET)
router.get('/', (req, res) => {
  res.render('index', { title: 'Employee Quotes' });
});

module.exports = router;