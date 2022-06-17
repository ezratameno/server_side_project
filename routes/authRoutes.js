const session = require('express-session');
const mongoose = require('mongoose');
//get the user schema from mongoose
const User = mongoose.model('users');
module.exports = function authRoutes(app) {
    // display the login form
    app.get("/login",(req,res) =>{
        // if user is auth
        if (req.session.authnticated)
        {
            res.redirect("/home")
            return
        }
        let loginFormErrors = {
            id: "",
            firstName: "",
            lastName: "",
            maritalStatus: "",
        } 
        res.render("loginPage",{loginFormErrors: loginFormErrors});
    });


    // get the form info and login the user
    app.post("/login",async (req,res) =>{
        if (req.session.authnticated)
        {
            res.redirect("/home")
            return
        }
        // save the user info to the session
        // TODO: verify that all the fields are non-empty
        let user = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            maritalStatus: req.body.maritalStatus
        }

        let loginErrorResulet = checkForLoginFormErrors(user)
        let loginFormErrors = loginErrorResulet[0]
        let isErrors = loginErrorResulet[1]

        // if there are errors in the login form we want to re-render the form to let the user 
        // know what he sholud do to correct the errors
        if (isErrors) {
            res.render("loginPage",{loginFormErrors: loginFormErrors})
            return
        }
        req.session.user = {
            user: user
        }
        try {
            const newUser = new User(user);
            await newUser.save()
        }  catch(err) {
            res.send(err)
        }
    
        
        // TODO: check using the id if the user is already at the database.
        // if not than we save it
        req.session.authnticated = true

        res.redirect("/home")
    });

    // check for errors in the login form
    function checkForLoginFormErrors(user) {
        let loginFormErrors = {
            id: "",
            firstName: "",
            lastName: "",
            maritalStatus: "",
        }
        let isErrors 
        isErrors = false
        if (user.id.length != 7) {
            loginFormErrors.id = "id must be 7 digits long"
            isErrors = true
        }
        if (isNaN(user.id)) {
            loginFormErrors.id = "id must be a number"
            isErrors = true
        }

        if (user.firstName == "") {
            loginFormErrors.firstName = "Must be a non empty field!"
            isErrors = true
        }
        if (user.lastName == "") {
            loginFormErrors.lastName = "Must be a non empty field!"
            isErrors = true
        }

        if (user.maritalStatus.toLowerCase() != "single" && user.maritalStatus.toLowerCase() != "married" ) {
            loginFormErrors.maritalStatus = "Marital status must be single or married"
            isErrors = true

        }
        return [loginFormErrors, isErrors]
    }

    app.get("/logout",(req,res) =>{
        req.session.authnticated = false
        res.redirect("/login")
    })
}