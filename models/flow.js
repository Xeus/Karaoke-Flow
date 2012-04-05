module.exports.configureSchema = function(Schema, mongoose) {

	var Flow = new Schema({
		flowID : Number,
		name : String,
		topic1 : String,
		topic2 : String,
		compiledFlow : String,
 		date : { type: Date, default: Date.now },
 		active : Boolean 
	});

	// add schemas to Mongoose
	mongoose.model('Flow', Flow);
};