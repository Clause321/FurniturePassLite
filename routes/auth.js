module.exports = function(app, passport){
    app
    .post('/signup', passport.authenticate('local-signup'), function(req, res){
        res.json(req.user);
    })
    .post('/login', passport.authenticate('local-login'), function(req, res){
        res.json(req.user);
    });
};