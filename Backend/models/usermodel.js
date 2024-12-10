const mongoose = require('mongoose');

//user export
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);


//enquiries export
const enq = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    message: { type: String, required: true }
});

const Enquiries = mongoose.model('Enquiry', enq);


module.exports = { User, Enquiries };