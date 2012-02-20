var express = require('express');
var ejs = require('ejs');
var app = express.createServer(express.logger());

/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/

/* Gonna have to add console.log() msgs to track the parameters,
 * namely the countdown clock. */

var flowArray = []; // holds each submitted flow event
var flowNumber, flowData;

app.get('/', function(request, response) {
    var templateData = {
        pageTitle : "Karaoke Flow"
    };
    response.render("index.html", templateData);
});

/* I think this'll need some work. Create a counter once someone
 * starts making rhymes, but it'll need an event ID so others can
 * access it immediately. */

app.get('/create', function(request, response) {
    var templateData = {
        pageTitle : "Step #1: Create da Rhymes :: Karaoke Flow"
    };
    response.render("create.html", templateData);
});




app.post('/create', function(request, response) {
    console.log("Inside app.post('/')");
    console.log("form received and includes:")
    console.log(request.body);
    var templateData = {
        pageTitle : "Step #1: Create da Rhymes :: Karaoke Flow"
    };
    
    var newFlow = {
        rhyme : request.body.rhyme,
        startTime : Date.now()
    };
    //console.log(newFlow.startTime);
    
    flowArray.push(newFlow);
    flowNumber = flowArray.length - 1;

    response.redirect("/perform/" + flowNumber);
});




app.get('/perform/:flowNumber', function(request, response) {
    flowNumber = request.params.flowNumber;
    flowData = flowArray[flowNumber];

    var templateData = {
        pageTitle : "Step #2: Perform da Rhymes :: Karaoke Flow"
    };

    if (flowData != undefined) {
        
        // Render the card_display template - pass in the cardData
        response.render("perform.html", flowData);
        
    } else {
        // card not found. show the 'Card not found' template
        response.render("notfound.html");
        
    }

});




// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


