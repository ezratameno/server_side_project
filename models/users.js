const mongoose = require('mongoose');
//destructuring

const {Schema} = mongoose;
const userSchema = new Schema({
    id: String,
    firstName: String,
    lastName: String,
    birthday: String,
    maritalStatus: String,
});

//creating the collection
mongoose.model('users',userSchema);