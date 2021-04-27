const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    firstName: { 
        type: String, 
        required: true, 
        maxLength: [127, "Max Length is 127 characters"] 
    },
    lastName: { 
        type: String, 
        required: true, 
        maxLength: [127, "Max lenght of 127 characters"] 
    },
    hireDate: { 
        type: Date, 
        required: true, 
        min: '1950-01-01', 
        max: Date.now() 
    },
    role: { 
        type: String, 
        enum: ['CEO', 'VP', 'MANAGER', 'LACKEY'], 
        required: true 
    },
    favouriteJoke: { 
        type: String, 
        required: true 
    },
    favouriteQuote: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);