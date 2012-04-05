
/* Module dependencies. */
var db = require('../accessDB');

module.exports = {

    // app.get('/'...)
    // userRoute.index
    index: function(request, response) {
      
        templateData = {}
        response.render('index.html', templateData);
    },

    // app.get('/register'...)
    getRegister: function(request, response) {
        response.render('register.html');
    },

    // app.post('/register'...)
    postRegister: function(request, response) {
        userData = {
              fname : request.param('firstname')
            , lname : request.param('lastname')
            , email : request.param('email')
            , password : request.param('password')
        }
        
        db.saveUser(userData, function(err,docs) {
            response.redirect('/account');
        });
    },

    postChangePassword : function(request, response) {
        if (request.param('password') == request.param('password2')) {
            
            //look up user
            db.User.findById(request.user._id, function(err, user){
                
                //set the new password
                user.set('password', request.param('password'));
                user.save();
                
                // set Flash message and redirect back to /account
                request.flash("message", "Password was updated");
                response.redirect('/account');
                
            })
            
        } else {
            
            request.flash("message", "Passwords Do Not Match");
            response.redirect('/account');
        }
    },
    
    // app.get('/login', ...
    login: function(request, response) {
        
        templateData = {
             message: request.flash('error')[0] // get error message is received from prior login attempt
        }
        
        response.render('login.html', templateData);
    },

    // app.get('/account', ensureAuthenticated, ...
    getAccount: function(request, response) {
        templateData = {
            currentUser : request.user,
            message : request.flash('message')[0] // get message is received from prior form submission like password change

        }
    
        response.render('account.html', templateData );
    },

    getUsers : function(request, response) {
        
        // query for all users only retrieve email and name
        db.User.find({},['email','name.first','name.last'], function(err,users) {
            
            if (err) {
                console.log(err);
                response.send("an error occurred");
            }
            
            response.json(users);
            
        })
        
    },
    
    // app.get('/logout'...)
    logout: function(request, response){
        request.logout();
        response.redirect('/');
    }

};