const session = require('express-session');

module.exports = function generalRoutes(app) {
    // will show the cost items of the user
    app.get("/home",function(req,res){
        console.log(req.session)
        res.render("home")
    });
}