module.exports.configureSchema = function(Schema, mongoose) {
	
	var FlowStat = new Schema({
		flowStatsID : Number,
		flowCount : Number,
		rhymeCount : Number
	});

	// add schemas to Mongoose
	mongoose.model('FlowStat', FlowStat);
};