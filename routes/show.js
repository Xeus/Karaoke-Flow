
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

            templateData = {
                pageTitle : "All Da Rhymes :: Karaoke Flow",
                rhymes: rhymes,
                admin: false,
                allLists : true // shows lists of rhymes/flows/stats nav if true
            };
            response.render('rhymes.html', templateData);
        });
    }

};