const PORT = process.env.PORT || 5000; 
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
require('./models/users');
require('./models/costs');
const authRoutes = require("./routes/authRoutes")
const generalRoutes = require('./routes/generalRoutes');
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const loginMiddleware = require('./middleware/loginMiddleware');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.use(session({
    secret: "some secret",
    // create a cookie for a day
    cookie: {maxAge: 60 * 1000 * 60 *24 * 10000},
    saveUninitialized: false
}))


// middleware to ensure the user is login
app.use(loginMiddleware)
authRoutes(app)
generalRoutes(app)

app.listen(PORT, ()=>
{
    console.log("server running on port "+ PORT);
})