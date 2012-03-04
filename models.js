module.exports.configureSchema = function(Schema, mongoose) {
	var Rhyme = new Schema({ 
		body : String,
		flowID : Number,
		topic1 : String,
		topic2 : String,
		date : { type: Date, default: Date.now }
	}); 

	var Flow = new Schema({
		flowID : Number,
		name : String,
		topic1 : String,
		topic2 : String,
		compiledFlow : String,
 		date : { type: Date, default: Date.now },
 		active : Boolean 
	});

	var FlowStat = new Schema({
		flowStatsID : Number,
		flowCount : Number,
		rhymeCount : Number
	});

	// add schemas to Mongoose
	mongoose.model('Flow', Flow);
	mongoose.model('Rhyme', Rhyme);	
	mongoose.model('FlowStat', FlowStat);
};