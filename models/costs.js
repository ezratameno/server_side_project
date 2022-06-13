const mongoose = require('mongoose');
//destructuring
const {Schema} = mongoose;

const costSchema = new Schema({
    id: String,
    // will be a map of year and month
    costs: Map
});
//creating the collection
mongoose.model('costs',costSchema);