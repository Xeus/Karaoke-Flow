/** routes.js
  */
var passport = require('passport');

// Route methods

var mainRoute = require('./routes/main');
var adminRoute = require('./routes/admin');
var showRoute = require('./routes/show');
var jsonRoute = require('./routes/json');
var userRoute = require('./routes/user');

// If user is authenticated, redirect to 
function ensureAuthenticated(request, response, next) {
  if (request.isAuthenticated()) { return next(); }

  request.flash("redirect",request.originalUrl);
  response.redirect('/login');
}

module.exports = function(app) {

    /*********** BLOG ROUTES ************/
    // More Mongoose query information here - http://mongoosejs.com/docs/finding-documents.html



    // ROUTES: main.js

    /* Gonna have to add console.log() msgs to track the parameters,
     * namely the countdown clock. */
    app.get('/', mainRoute.intro);

    // make default id / fix flow count
    // count() won't work
    app.get('/create', mainRoute.createGET);
    // check if room actually exists?  redirects?
    app.post('/create', mainRoute.createPOST);

    /* some weird thing where it does /create/0 twice, but flowCount
     * is correct in the FlowStat schema */
    // creates new room
    app.post('/createnew', mainRoute.createNew);

    // app.post exists too
    app.get('/create/:flowID', mainRoute.createFlowIDGET);
    // app.get exists too
    app.post('/create/:flowID', mainRoute.createFlowIDPOST);

    app.get('/perform/random', mainRoute.performRandom); // flow of random rhymes
    app.get('/perform/:flowID', mainRoute.performFlowID); // karaoke performance page
    app.get('/about', mainRoute.about);


    // ROUTES: show.js
    app.get('/flows', showRoute.showFlows);
    app.get("/rhymes", showRoute.showRhymes);
    app.get('/stats', showRoute.showStats);



    // ROUTES: admin.js
    app.get("/flows/edit", ensureAuthenticated, adminRoute.editAllFlows);
    app.get("/flows/:flowID/edit", ensureAuthenticated, adminRoute.editFlow);
    app.get("/flows/update/:flowID", ensureAuthenticated, adminRoute.updateFlow);
    app.get("/rhymes/edit", ensureAuthenticated, adminRoute.editAllRhymes);
    app.get("/rhymes/:rhymeID/edit", ensureAuthenticated, adminRoute.editRhyme);
    app.post("/rhymes/update", ensureAuthenticated, adminRoute.updateRhyme);
    app.get("/stats/edit", ensureAuthenticated, adminRoute.editStats);
    app.post('/delete/:numRhyme', adminRoute.deleteRhyme);



    // ROUTES: json.js
    app.get('/rhymes/json', jsonRoute.jsonRhymes);
    app.get('/flows/json', jsonRoute.jsonFlows);
    app.get('/all/json', jsonRoute.jsonAll);



    // ROUTES: user.js
    
    // Register User - display page
    app.get('/register', userRoute.getRegister);
    
    //Register User - receive registration post form
    app.post('/register', userRoute.postRegister);
    
    // Display login page
    app.get('/login', userRoute.login);
    
    // Login attempted POST on '/local'
    // Passport.authenticate with local email and password, if fails redirect back to GET /login
    // If successful, redirect to /account
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(request, response) {
        if (request.param('redirect') != "") {
            //redirect to page that initiated Login request
            response.redirect( request.param('redirect') );
        } else {
            response.redirect('/account');
        }
        //response.redirect('/account');
    });
    
    // Display account page
    app.get('/account', ensureAuthenticated, userRoute.getAccount);

    app.post('/account/changepassword', ensureAuthenticated, userRoute.postChangePassword),
    
    // Logout user
    app.get('/logout', userRoute.logout);

    app.get('/getusers', userRoute.getUsers);

}