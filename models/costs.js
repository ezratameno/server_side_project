const mongoose = require('mongoose');
//destructuring
const {Schema} = mongoose;

const costSchema = new Schema({
    description: String,
    sum: String,
    category: String
    // need date
});
//creating the collection
mongoose.model('costs',costSchema);