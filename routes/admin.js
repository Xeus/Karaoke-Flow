
/* Module dependencies. */
var db = require('../accessDB');

module.exports = {

    // ******** ADMIN STUFF *************
    // admin stuff all below

    editFlow: function(request, response) {
        db.Flow.find({}, function (err, flows) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            templateData = {
                pageTitle : "All Da Flows :: Karaoke Flow",
                flows : flows,
                admin: true,
                allLists : true // shows lists of rhymes/flows/stats nav if true
            };
            response.render('flows.html', templateData);
        });
    },

    // TODO: make this functional
    updateFlow: function(request, response) {
        var requestedFlowID = request.params.flowID;

        // find the requested document
        db.Flow.findOne({ flowID: requestedFlowID }, function(err, flow) {
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
                    admin: true,
                    allLists : true // shows lists of rhymes/flows/stats nav if true
                };
                response.render('flow_update.html', templateData);
            }
        });

    },

    editAllRhymes: function(request, response) {
        db.Rhyme.find({}, function (err, rhymes) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            templateData = {
                pageTitle : "All Da Rhymes :: Karaoke Flow",
                rhymes: rhymes,
                admin: true,
                allLists : true // shows lists of rhymes/flows/stats nav if true
            };
            response.render('rhymes_edit.html', templateData);
        });
    },

    editRhyme: function(request, response) {
        db.Rhyme.findOne({ rhymeID: request.params.rhymeID }, function (err, rhymes) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            templateData = {
                pageTitle : "All Da Rhymes :: Karaoke Flow",
                rhymes: rhymes,
                admin: true,
                allLists : true // shows lists of rhymes/flows/stats nav if true
            };
            response.partial('rhyme_single_edit.html', templateData);
        });
    },

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
                    status :'OK'
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
    stats: function(request, response) {
        db.FlowStat.findOne({ flowStatsID: 0 }, function (err, stats) {

            if (err) {
                //an error occurred
                console.log("something went wrong");
            }

            templateData = {
                pageTitle : "Statistics :: Karaoke Flow",
                stats : stats,
                admin : true,
                allLists : true // shows lists of rhymes/flows/stats nav if true
            };
            response.render('stats.html', templateData);
        });
    }

};