const mongoose = require('mongoose');
//destructuring
const {Schema} = mongoose;

const costSchema = new Schema({
    id: String,
    // will be a map of year and month
    costs: {
        type: Map,
        of: {
            items: {
                type: Array,
                of: {
                    sum: Number,
                    description: String,
                    category: String,
                    date: String,
                    id: String
                }
            },
            total: Number
        }
    }
});
//creating the collection
mongoose.model('costs',costSchema);