const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    name: String,
    numberOfCourses: Number
});

module.exports = mongoose.model('Student', studentSchema);