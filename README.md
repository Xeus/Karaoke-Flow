# Karaoke Flow

by Ben Turner (@Xeus)

# Description

Project for John Schimmel's Dynamic Web Development class.

Party game.  People get 5 minutes to create rhymes from a prompt of 2 common rap
topics.  Then when time's up, someone has to perform the song and should be
judged on his/her flow!

# Installation

Open your terminal/shell/command prompt.  Make sure you have Node.js installed.

	http://nodejs.org/

Clone the repository.  Type 'git clone git@github.com:Xeus/Karaoke-Flow.git' in
the parent directory you wish to install "./Karaoke-Flow" to.

See package.json for dependencies.  Type 'npm install' to install them. Uses
MongoDB and the Heroku toolbelt.

	http://www.mongodb.org/downloads
	https://toolbelt.heroku.com/

Set up your .env file to include your MONGOLAB_URI variable, which has your
user/pass to connect to MongoDB.

Type 'foreman start' in the "./Karaoke-Flow" directory to start up the
node.js process.

Connect to http://localhost:5000 to get your flow started!  Or see an
online demo at http://karaokeflow.herokuapp.com/ with a populated db.

# Changes

Last update 24 Apr 12: Added more helpful comments/docs, updated README.md.

# TODO:
- fix gap in looped beat tracks (HTML5 bug?)
- insert choruses
- insert random rappers' rhymes
- add more phat beats (from Raj?)
- karaoke highlighting line-by-line for performance? (partial)
- hook up to microphone & beat machine & recorder?
