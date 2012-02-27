var express = require('express');
var ejs = require('ejs'); // EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
var app = express.createServer(express.logger());

/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    app.set('view engine','ejs');
    app.set('views',__dirname+ '/views');
    app.set('view options',{layout:true});
    app.register('html',require('ejs'));
    app.use(express.static(__dirname + '/static'));
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var mongoose = require('mongoose');
var schema = mongoose.Schema; 

/************ DATABASE CONFIGURATION **********/
app.db = mongoose.connect(process.env.MONGOLAB_URI); // requires .env file

require('./models').configureSchema(schema, mongoose);

var Flow = mongoose.model('Flow');
var Rhyme = mongoose.model('Rhyme');
var FlowStat = mongoose.model('FlowStat');




/* Gonna have to add console.log() msgs to track the parameters,
 * namely the countdown clock. */

app.get('/', function(request, response) {
    var templateData = {
        pageTitle : "Karaoke Flow"
    };
    response.render("index.html", templateData);
});




/* I think this'll need some work. Create a counter once someone
 * starts making rhymes, but it'll need an event ID so others can
 * access it immediately. */

 // make default id / fix flow count

app.get('/create', function(request, response) {
    console.log("Inside app.get('/create')");

    var flowCount = Flow.count(); // count starts at 0
    console.log(flowCount);
    
    var randRoomNum = Math.floor(Math.random()*10000);
    var randRoomName = "room" + randRoomNum;

    // prepare new flow with the form data
    var flowData = {
        flowID : flowCount,
        name : randRoomName
    };
    
    var newFlow = new Flow(flowData);
    newFlow.save();

    response.redirect("/create/" + flowID); // send to general /create page
});




app.post('/createnew', function(request, response) {
    console.log("Inside app.post('/createnew')");
    console.log("form received and includes:")
    console.log(request.body);

    FlowStat.findOne({ flowStatsID : 0 }, function(err, flowCountRecord) {
        if (err) { console.log(err); }
        if (flowCountRecord == null) {
            console.log("flowCount null");
            var flowStatsData = {
                flowStatsID : 0,
                flowCount : 0
            };
            var newFlowStat = new FlowStat(flowStatsData);
            newFlowStat.save();
            console.log("saved to FlowStat: " + flowStatsData);
        }
        else {
            console.log("found count");
            var flowStatsData = {
                flowStatsID : 0,
                flowCount : flowCountRecord.flowCount
            };
        }

        var flowData = {
            flowID : flowStatsData.flowCount,
            name : request.body.newFlowName
        };
    
        var newFlow = new Flow(flowData);
        newFlow.save();

        FlowStat.find({ flowStatsID : 0 }).update( { $inc: { flowCount : 1 } } );

        response.redirect("/create/" + flowData.flowID); // send to specific ID'd /create page
    });

});





app.post('/create', function(request, response) {
    console.log("Inside app.post('/create')");
    console.log("form received and includes:")
    console.log(request.body);
   
    Flow.findOne({name:request.params.flowName}, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find that flow!");
        }
        else {
            // have to do checking for multiple rooms w/ same name
            response.redirect("/create/" + flow.flowID); // send to general /create page
        }
    });
});



app.get('/create/:flowID', function(request, response) {
    console.log("Inside app.post('/create/id')");
    console.log("form received and includes:")
    console.log(request.body);
    
    /*
    var newFlow = {
        rhyme : request.body.rhyme,
        startTime : Date.now()
    };
    //console.log(newFlow.startTime);
    
    flowArray.push(newFlow);
    flowNumber = flowArray.length - 1;
    */

    var topics = new Array('basketball', 'fame', 'football', 'women', 'riches', 'violence', 'nyc','oakland', 'cops', 'federal govt', 'mom', 'dad', 'swag', 'tennis', 'twitter', 'skype', 'champagne', 'itp');

    getRandomTopic = function() { return Math.floor(Math.random() * topics.length); };
    var randomTopicNum1 = getRandomTopic();
    var randomTopicNum2 = getRandomTopic();


    Flow.findOne({name:request.params.flowName}, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find that flow!");
        }
        else {

    var flowCount = Flow.count(); // count starts at 0
    console.log(flowCount);
    if (isNaN(flowCount)) {
        flowCount = 0;
    }
    
    // Prepare, save and redirect

    var rhymeData = {
        body : request.body.rhyme,
        flowID : flowCount
    };

    //console.log(newFlow.startTime);

    var newRhyme = new Rhyme(rhymeData);
    newRhyme.save;
        
    // prepare new flow with the form data
    var flowData = {
        flowID : flowCount,
        name : request.body.topic1,
        text : request.body.topic2,
        compiledFlow : request.body.rhyme
    };
        
    // create new comment
    var newFlow = new Flow(flowData);
    
    newFlow.save();

    var templateData = {
        pageTitle : "Step #2: Create da Rhymes :: Karaoke Flow",
        randomTopic1 : topics[randomTopicNum1],
        randomTopic2 : topics[randomTopicNum2]
    };

    response.render("create.html", templateData);
        }
    });

});




app.get('/perform/:flowNumber', function(request, response) {

    var templateData = {
        pageTitle : "Step #2: Perform da Rhymes :: Karaoke Flow"
    };

    Flow.findOne({flowID:request.params.flowNumber}, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find that flow!");
        }

        // Render the perform template - pass in the flowData.
        response.render("perform.html", flowData);

    });

});




// Make server turn on and listen at defined PORT (or port 3000 if is not defined).
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


