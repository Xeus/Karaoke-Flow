module.exports.configureSchema = function(Schema, mongoose) {
	var Rhyme = new Schema({ 
		body : String,
		flowID : Number
	}); 

	var Flow = new Schema({
		flowID : Number,
		name : String,
		topic1 : String,
		topic2 : String,
		compiledFlow : String,
 		date : { type: Date, default: Date.now }
	}); 

	// add schemas to Mongoose
	mongoose.model('Flow', Flow);
	mongoose.model('Rhyme', Rhyme);	
};