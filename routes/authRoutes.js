const session = require('express-session');

module.exports = function authRoutes(app) {
    // display the login form
    app.get("/login",(req,res) =>{
        // if user is auth
        if (req.session.authnticated)
        {
            res.redirect("/home")
            return
        }
        console.log(req.session);
        // need to add the 
        res.render("loginPage");
    });


    // get the form info and login the user
    app.post("/login",(req,res) =>{
        if (req.session.authnticated)
        {
            res.redirect("/home")
            return
        }
        // save the user info to the session
        let user = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            maritalStatus: req.body.maritalStatus

        }
        req.session.user = {
            user: user
        }
        // TODO: check using the id if the user is already at the database.
        // if not than we save it
        req.session.authnticated = true

        console.log(req.session)
        res.redirect("/home")
    });
}