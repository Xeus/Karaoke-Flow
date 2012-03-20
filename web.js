var express = require('express');
var ejs = require('ejs'); // EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
var app = express.createServer(express.logger());
var requestURL = require('request');

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
// Am also using foreman start/kf aliases to run locally.

app.db = mongoose.connect(process.env.MONGOLAB_URI); // requires .env file
require('./models').configureSchema(schema, mongoose);
var Flow = mongoose.model('Flow');
var Rhyme = mongoose.model('Rhyme');
var FlowStat = mongoose.model('FlowStat');




/* Gonna have to add console.log() msgs to track the parameters,
 * namely the countdown clock. */

app.get('/', function(request, response) {

    var flowNames = [];

    Flow.find({ active : true }, ["name"], function(err, activeFlowNames) {
        if (err) { console.log(err); }
        console.log(activeFlowNames.length);

        for (var i=0;i<activeFlowNames.length;i++) {
            flowNames.push(activeFlowNames[i].name);
        }

        var templateData = {
            pageTitle : "Karaoke Flow",
            activeFlowNames : flowNames,
            admin : false
        };
    
        response.render("index.html", templateData);
    });
});




 // make default id / fix flow count
 // count() won't work

app.get('/create', function(request, response) {
    console.log("Inside app.get('/create')");

    var flowCount = Flow.count(); // count starts at 0
    console.log(flowCount);
    
    var randRoomNum = Math.floor(Math.random()*10000); // makes somewhat random room name
    var randRoomName = "room" + randRoomNum;

    // prepare new flow with the form data
    var flowData = {
        flowID : flowCount,
        name : randRoomName,
        admin : false
    };
    
    var newFlow = new Flow(flowData);
    newFlow.save();

    response.redirect("/create/" + flowID); // send to general /create page
});





/* some weird thing where it does /create/0 twice, but flowCount
 * is correct in the FlowStat schema */

// creates new room
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
                flowCount : 0,
                rhymeCount : 0
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
            name : request.body.newFlowName,
            active : true
        };
    
        var newFlow = new Flow(flowData);
        newFlow.save();

        FlowStat.findOne({ flowStatsID : 0 }).update( { $inc: { flowCount : 1 } } );

        response.redirect("/create/" + flowData.flowID); // send to specific ID'd /create page
    });

});




// check if room actually exists?  redirects?
app.post('/create', function(request, response) {
    console.log("Inside app.post('/create')");
    console.log("form received and includes:")
    console.log(request.body);
   
    Flow.findOne({ name : request.body.flowName, active : true }, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find an active flow by that name.");
        }
        else {
            console.log(flow);
            if (flow == null) {
                var templateData = {
                    pageTitle : "Karaoke Flow"
                };
                response.send("Flow not found. :(");
            }
            else {
                // have to do checking for multiple rooms w/ same name
                response.redirect("/create/" + flow.flowID); // send to general /create page
            }
        }
    });
});



// app.post exists too
app.get('/create/:flowID', function(request, response) {
    console.log("Inside app.post('/create/:flowID')");
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

    // returns number reference, use with array topics to get actual string result
    getRandomTopic = function() { return Math.floor(Math.random() * topics.length); };
    var randomTopicNum1 = getRandomTopic();
    var randomTopicNum2 = getRandomTopic();

    Flow.findOne({ flowID : request.params.flowID }, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find that flow!");
        }
        else {

            // timer set to 5 minutes from create date (* 60 seconds * 1000 milliseconds)
            var minutes = 5;
            var endTime = flow.date.valueOf() + 60 * minutes * 1000;
            console.log("endTime: " + endTime);
            console.log("flow.date: " + flow.date.valueOf());
            var currentTime = new Date();
            console.log("currentTime: " + currentTime.valueOf());
            var timeRemaining = Math.floor((endTime - currentTime.valueOf()) / 1000);
            var templateData = {
                pageTitle : "Step #2: Create da Rhymes :: Karaoke Flow",
                randomTopic1 : topics[randomTopicNum1],
                randomTopic2 : topics[randomTopicNum2],
                flow : flow,
                timeRemaining : timeRemaining,
                admin : false
            };

            if (timeRemaining <= 1) {
                response.redirect("/perform/" + flow.flowID);
            }
            else {
                response.render("create.html", templateData);
            }
        }
    });

});


// app.get exists too
app.post('/create/:flowID', function(request, response) {
    console.log("Inside app.post('/create/:flowID')");
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

    Flow.findOne({ flowID : request.params.flowID }, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find that flow!");
        } // /end if error
        else {

            // timer set to 5 minutes from create date (* 60 seconds * 1000 milliseconds)
            var minutes = 5;
            var endTime = flow.date.valueOf() + 60 * minutes * 1000;
            console.log("endTime: " + endTime);
            console.log("flow.date: " + flow.date.valueOf());
            var currentTime = new Date();
            console.log("currentTime: " + currentTime.valueOf());
            var timeRemaining = Math.floor((endTime - currentTime.valueOf()) / 1000);

            FlowStat.findOne({ flowStatsID: 0 }, function(err, getRhymeCount) {
                var nextRhymeCount = getRhymeCount.rhymeCount+1;
                var rhymeData = {
                    body : request.body.rhyme,
                    rhymeID : nextRhymeCount,
                    flowID : request.params.flowID,
                    topic1 : request.body.topic1,
                    topic2 : request.body.topic2
                };

                var newRhyme = new Rhyme(rhymeData);
                newRhyme.save();

            });
        
            // TODO -- isn't saving to db?
            var flowData = {
                topic1 : request.body.topic1,
                topic2 : request.body.topic2
            };

            rhymesTemp = request.body.rhyme;
            rhymesJoined = rhymesTemp.join("|");

            FlowStat.findOne({ flowStatsID : 0 }).update( { $inc: { rhymeCount : 1 } } );
            Flow.findOne({ flowID : request.params.flowID }).update({ $push : { compiledFlow : rhymesJoined, topic1 : request.body.topic1, topic2 : request.body.topic2 } });

            var templateData = {
                pageTitle : "Step #2: Create da Rhymes :: Karaoke Flow",
                randomTopic1 : request.body.topic1,
                randomTopic2 : request.body.topic2,
                flow : flow,
                timeRemaining : timeRemaining,
                admin : false
            };

            if (timeRemaining <= 0) {
                response.redirect("/perform/" + flow.flowID);
            }
            else {
                response.render("create.html", templateData);
            }
        } // /end if no error
    });

});




app.get('/perform/:flowID', function(request, response) {

    Flow.findOne({ flowID : request.params.flowID }, function(err,flow) {

        if (err) {
            console.log('Error');
            console.log(err);
            response.send("Uh oh, can't find that flow!");
        }
        else {

            var rhymes = flow.compiledFlow;
            if (rhymes == undefined || rhymes == null) {
                rhymes = "[no rhymes entered]";
            }

            var flowData = {
                flowName : flow.name,
                pageTitle : "Step #2: Perform da Rhymes :: Karaoke Flow",
                rhymes : rhymes,
                admin : false
            };

            // Render the perform template - pass in the flowData.
            response.render("perform.html", flowData);
        }

    });

});




app.get('/about', function(request, response) {
    var templateData = {
        pageTitle : "What's All This About?",
        admin : false
    };

    response.render("about.html", templateData);
});



// admin stuff all below

app.get("/flows", function(request, response) {
    Flow.find({}, function (err, flows) {

        if (err) {
            //an error occurred
            console.log("something went wrong");
        }

        templateData = {
            pageTitle : "All Da Flows :: Karaoke Flow",
            flows : flows,
            admin: true
        };
        response.render('flows.html', templateData);
    });
});



// TODO -- make this functional
app.get("/flows/update/:flowID", function(request, response) {
    var requestedFlowID = request.params.flowID;

    // find the requested document
    Flow.findOne({ flowID: requestedFlowID }, function(err, flow) {
        if (err) {
            console.log(err);
            response.send("An error occurred!");
        }

        if (flow == null ) {
            console.log('Flow not found.');
            response.send("Uh oh, can't find that flow.");

        }
        else {
            templateData = {
                pageTitle : "Update Dat Specific Flow :: Karaoke Flow",
                flow : flow,
                updated : request.query.update,
                admin: true
            };
            response.render('flow_update.html', templateData);
        }
    });

});


app.get("/rhymes", function(request, response) {
    Rhyme.find({}, function (err, rhymes) {

        if (err) {
            //an error occurred
            console.log("something went wrong");
        }

        templateData = {
            pageTitle : "All Da Rhymes :: Karaoke Flow",
            rhymes: rhymes,
            admin: true
        };
        response.render('rhymes.html', templateData);
    });
});



app.post("/rhymes/update", function(request, response){
    var rhymeID = request.body.rhymeID;

    var condition = { rhymeID: rhymeID };

    // update these fields with new values
    var updatedData = {
        body : request.body.rhymeBody,
        topic1 : request.body.rhymeTopic1,
        topic2 : request.body.rhymeTopic2
    };

    // we only want to update a single document
    var options = { multi : false };

    Rhyme.update(condition, updatedData, options, function(err, numAffected){

        if (err) {
            console.log('Update Error Occurred');
            response.send('Update Error Occurred ' + err);
        }
        else {
            console.log("Update succeeded.");
            console.log(numAffected + " document(s) updated.");

            //redirect the user to the update page - append ?update=true to URL
            response.redirect('/rhymes');
        }
    });

});



app.get("/stats", function(request, response) {
    FlowStat.findOne({ flowStatsID: 0 }, function (err, stats) {

        if (err) {
            //an error occurred
            console.log("something went wrong");
        }

        templateData = {
            pageTitle : "Statistics :: Karaoke Flow",
            stats : stats,
            admin : true
        };
        response.render('stats.html', templateData);
    });
});


// JSON REST blahblah
app.get('/rhymes/json', function(request, response){

    // define the fields you want to include in your json data
    includeFields = ['rhymeID','flowID','body','topic1','topic2','date']

    // query for all blog
    queryConditions = {}; //empty conditions - return everything
    var query = Rhyme.find( queryConditions, includeFields);

    query.sort('date',-1); //sort by most recent
    query.exec(function (err, rhymes) {

        // render the card_form template with the data above
        jsonData = {
          'status' : 'OK',
          'JSONtitle' : 'All Karaoke Flow Rhymes',
          'rhymes' : rhymes
        }

        response.json(jsonData);
    });
});



// Make server turn on and listen at defined PORT (or port 3000 if is not defined).
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


