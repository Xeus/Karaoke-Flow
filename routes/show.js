
/* Module dependencies. */
var db = require('../accessDB');

module.exports = {

    // outputs read-only list of all rhymes
    showRhymes: function(request, response) {
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
                admin: false,
                loggedIn : loggedIn
            };
            response.render('rhymes.html', templateData);
        });
    },

    // outputs read-only list of all rhymes
    showFlows: function(request, response) {
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
                admin: false,
                loggedIn : loggedIn
            };
            response.render('flows.html', templateData);
        });
    },

    // some basic stats to edit for the KF site
    showStats: function(request, response) {
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
                admin : false,
                loggedIn : loggedIn
            };
            response.render('stats.html', templateData);
        });
    }

};