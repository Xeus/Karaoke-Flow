
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
    },

    intro: function(request, response) {
        var flowNames = [];

        db.Flow.find({ active : true }, ["name"], function(err, activeFlowNames) {
            if (err) { console.log(err); }
            console.log(activeFlowNames.length);

            // autocomplete for finding active flows via input field
            for (var i=0;i<activeFlowNames.length;i++) {
                flowNames.push(activeFlowNames[i].name);
            }

            var templateData = {
                pageTitle : "Karaoke Flow",
                activeFlowNames : flowNames,
                admin : false, // shows admin nav if true
                allLists : false // shows lists of rhymes/flows/stats nav if true
            };
    
            response.render("index.html", templateData);
        });
    },

    createGET: function(request, response) {
        console.log("Inside app.get('/create')");

        var flowCount = Flow.count(); // count starts at 0
        console.log(flowCount);
    
        var randRoomNum = Math.floor(Math.random()*10000); // makes somewhat random room name
        var randRoomName = "room" + randRoomNum;

        // prepare new flow with the form data
        var flowData = {
            flowID : flowCount,
            name : randRoomName,
            admin : false,
            allLists : false // shows lists of rhymes/flows/stats nav if true
        };
    
        var newFlow = new Flow(flowData);
        newFlow.save();

        response.redirect("/create/" + flowID); // send to general /create page
    },

    createNew: function(request, response) {
        console.log("Inside app.post('/createnew')");
        console.log("form received and includes:")
        console.log(request.body);

        db.FlowStat.findOne({ flowStatsID : 0 }, function(err, flowCountRecord) {
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

            // increment global flow number count
            db.FlowStat.findOne({ flowStatsID : 0 }).update( { $inc: { flowCount : 1 } } );

            response.redirect("/create/" + flowData.flowID); // send to specific ID'd /create page
        });

    },

    createPOST: function(request, response) {
        console.log("Inside app.post('/create')");
        console.log("form received and includes:")
        console.log(request.body);
       
        db.Flow.findOne({ name : request.body.flowName, active : true }, function(err,flow) {

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
    },

    createFlowIDGET: function(request, response) {
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

        db.Flow.findOne({ flowID : request.params.flowID }, function(err,flow) {

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
                    admin : false,
                    allLists : false
                };

                if (timeRemaining <= 1) { // if no time left, auto-fwd to last pg
                    response.redirect("/perform/" + flow.flowID);
                }
                else { // or just keep adding rhymes
                    response.render("create.html", templateData);
                }
            }
        });

    },

    createFlowIDPOST: function(request, response) {
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

        db.Flow.findOne({ flowID : request.params.flowID }, function(err,flow) {

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

                db.FlowStat.findOne({ flowStatsID: 0 }, function(err, getRhymeCount) {
                    var nextRhymeCount = getRhymeCount.rhymeCount+1;
                    var rhymesTemp = request.body.rhyme;
                    var rhymesJoined = rhymesTemp.join("|");
                    rhymesJoined.replace(",",", ");
                    var rhymeData = {
                        body : rhymesJoined,
                        rhymeID : nextRhymeCount,
                        flowID : request.params.flowID,
                        topic1 : request.body.topic1,
                        topic2 : request.body.topic2
                    };

                    var newRhyme = new Rhyme(rhymeData);
                    newRhyme.save();

                });
            
                // TODO: is it saving to db?
                var flowData = {
                    topic1 : request.body.topic1,
                    topic2 : request.body.topic2
                };

                var rhymesTemp = request.body.rhyme;
                var rhymesJoined = rhymesTemp.join("|");
                rhymesJoined.replace(",",", ");

                db.FlowStat.findOne({ flowStatsID : 0 }).update( { $inc: { rhymeCount : 1 } } );
                db.Flow.findOne({ flowID : request.params.flowID }).update({ $push : { compiledFlow : rhymesJoined, topic1 : request.body.topic1, topic2 : request.body.topic2 } });

                var templateData = {
                    pageTitle : "Step #2: Create da Rhymes :: Karaoke Flow",
                    randomTopic1 : request.body.topic1,
                    randomTopic2 : request.body.topic2,
                    flow : flow,
                    timeRemaining : timeRemaining,
                    admin : false,
                    allLists : false // shows lists of rhymes/flows/stats nav if true
                };

                if (timeRemaining <= 0) {
                    response.redirect("/perform/" + flow.flowID);
                }
                else {
                    response.render("create.html", templateData);
                }
            } // /end if no error
        });

        },

    performFlowID: function(request, response) {

        db.Flow.findOne({ flowID : request.params.flowID }, function(err,flow) {

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
                    admin : false,
                    allLists : false, // shows lists of rhymes/flows/stats nav if true
                    layout: false // has its own layout
                };

                // Render the perform template - pass in the flowData.
                response.render("perform.html", flowData);
            }

        });

    },

    about: function(request, response) {
        var templateData = {
            pageTitle : "What's All This About?",
            admin : false,
            allLists : true // shows lists of rhymes/flows/stats nav if true
        };

        response.render("about.html", templateData);
    }

};