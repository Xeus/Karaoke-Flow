
/* Module dependencies. */
var db = require('../accessDB');

module.exports = {

    // ******** ADMIN STUFF *************
    // admin stuff all below

    // lets you view and edit all flows at once
    editAllFlows: function(request, response) {
        if (request.user) { admin = true; } else { admin = false; }
        db.Flow.find({}, function (err, flows) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            // will show admin nav edit links if logged in
            if (request.user) { var loggedIn = true; } else { var loggedIn = false; }

            templateData = {
                pageTitle : "All Da Flows :: Karaoke Flow",
                flows : flows,
                admin: admin,
                loggedIn : loggedIn
            };
            response.render('flows_edit.html', templateData);
        });
    },

    // edit one flow via ajax
    editFlow: function(request, response) {
        if (request.user) { admin = true; } else { admin = false; }
        db.Flow.findOne({ flowID: request.params.flowID }, function (err, flows) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            // will show admin nav edit links if logged in
            if (request.user) { var loggedIn = true; } else { var loggedIn = false; }

            templateData = {
                pageTitle : "All Da Flows :: Karaoke Flow",
                flows : flows,
                admin: admin,
                loggedIn : loggedIn
            };
            response.partial('flow_single_edit.html', templateData);
        });
    },

    // updates one flow via ajax
    updateFlow: function(request, response) {
        if (request.user) { admin = true; } else { admin = false; }
        var requestedFlowID = request.params.flowID;

        // find the requested document
        db.Flow.findOne({ flowID: requestedFlowID }, function(err, flow) {
            if (err) {
                console.log(err);
                response.send("An error occurred!");
            }

            // will show admin nav edit links if logged in
            if (request.user) { var loggedIn = true; } else { var loggedIn = false; }

            if (flow == null ) {
                console.log('Flow not found.');
                response.send("Uh oh, can't find that flow.");

            }
            else {
                templateData = {
                    pageTitle : "Update Dat Specific Flow :: Karaoke Flow",
                    flow : flow,
                    updated : request.query.update,
                    admin: admin,
                    loggedIn : loggedIn
                };
                response.render('flow_update.html', templateData);
            }
        });

    },

    // view and edit all rhymes at once
    editAllRhymes: function(request, response) {
        if (request.user) { admin = true; } else { admin = false; }
        db.Rhyme.find({}, function (err, rhymes) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            // will show admin nav edit links if logged in
            if (request.user) { var loggedIn = true; } else { var loggedIn = false; }

            templateData = {
                pageTitle : "All Da Rhymes :: Karaoke Flow",
                rhymes: rhymes,
                admin: admin,
                loggedIn : loggedIn
            };
            response.render('rhymes_edit.html', templateData);
        });
    },

    // view one rhyme via ajax
    editRhyme: function(request, response) {
        if (request.user) { admin = true; } else { admin = false; }
        db.Rhyme.findOne({ rhymeID: request.params.rhymeID }, function (err, rhymes) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            // will show admin nav edit links if logged in
            if (request.user) { var loggedIn = true; } else { var loggedIn = false; }

            templateData = {
                pageTitle : "All Da Rhymes :: Karaoke Flow",
                rhymes: rhymes,
                admin: admin,
                loggedIn : loggedIn
            };
            response.partial('rhyme_single_edit.html', templateData);
        });
    },

    // edit and update one rhyme via ajax
    updateRhyme: function(request, response){
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

        db.Rhyme.update(condition, updatedData, options, function(err, numAffected){

            if (err) {
                console.log('Update error occurred.');
                response.send('Update error occurred ' + err);
            }

            if (request.xhr) { // if request sent via AJAX
                console.log("Update succeeded.");
                console.log(numAffected + " document(s) updated.");

                //redirect the user to the update page - append ?update=true to URL
                response.json({
                    status : 'OK'
                });
            }
            else {
                console.log('updated normally');
                // redirect to the blog entry
                response.redirect('/rhymes');
            }
        });

    },

    // some basic stats to edit for the KF site
    editStats: function(request, response) {
        if (request.user) { admin = true; } else { admin = false; }
        db.FlowStat.findOne({ flowStatsID: 0 }, function (err, stats) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            // will show admin nav edit links if logged in
            if (request.user) { var loggedIn = true; } else { var loggedIn = false; }

            templateData = {
                pageTitle : "Statistics :: Karaoke Flow",
                stats : stats,
                admin : admin,
                loggedIn : loggedIn
            };
            response.render('stats_edit.html', templateData);
        });
    },

    deleteRhyme: function(request, response) {
        console.log("firedx2");
        if (request.user) { admin = true; } else { admin = false; }
        db.Rhyme.findOne({ rhymeID : request.params.numRhyme }, function (err, delRhyme) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }
            else {
                db.Rhyme.remove({ "rhymeID" : delRhyme.rhymeID }, function (err, success) { if (err) {console.log("nope");} else { console.log('yep');} });
                // important to keep the count right too
                db.FlowStat.findOne({ flowStatsID : 0 }).update( { $inc: { rhymeCount : -1 } } );
                response.json({ status : 'OK' });
            }
        
        });
    }


};