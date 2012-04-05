// Ben Turner
// Dynamic Web Dev, John Schimmel, NYU-ITP

// index -> create -> perform
// admin -> rhymes, flows, rhymes/edit, rhymes/update, etc.

var express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    ejs = require('ejs'), // https://github.com/visionmedia/ejs
    routes = require('./routesConfig'),
    DB = require('./accessDB').AccessDB,
    mongoStore = require('connect-mongodb');

var app = module.exports = express.createServer(express.logger());
global.app = app;
var requestURL = require('request');

var DB = require('./accessDB');
var db = new DB.startup(process.env.MONGOLAB_URI);

/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    app.set('view engine','ejs');
    app.set('views',__dirname+ '/views');
    app.set('view options',{layout:true});
    app.register('html',require('ejs'));
    app.use(express.static(__dirname + '/static')); // set static dir for flat files
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.cookieParser()); //Cookies must be turned on for Sessions
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.methodOverride());

    app.use(express.session({ 
            store: mongoStore({url:process.env.MONGOLAB_URI}),
            secret: 'SuperSecretString'
        }, function() {
            app.use(app.router);
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
});

require('./routesConfig')(app);


// Make server turn on and listen at defined PORT (or port 3000 if is not defined).
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});