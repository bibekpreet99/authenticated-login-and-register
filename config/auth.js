module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated){
            next()
        }

        req.flash('error_msg', 'You need to log in first')
        res.redirect('/users/login')
    }
}