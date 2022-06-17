
module.exports = function loginMiddleware(req,res,next){
    // check if seesion have a value of authnthecated
    // at first the value of authnticated is undefiend
    // we only want to redirect only if we are not alreay at the login page
    if ((typeof req.session.authnticated == 'undefined' || !req.session.authnticated ) && req.url != '/login') {
        res.redirect("/login")
    }
    next()
}