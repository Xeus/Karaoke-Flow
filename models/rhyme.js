module.exports.configureSchema = function(Schema, mongoose) {
	var Rhyme = new Schema({ 
		body : String,
		rhymeID : Number,
		flowID : Number,
		topic1 : String,
		topic2 : String,
		date : { type: Date, default: Date.now }
	}); 

	mongoose.model('Rhyme', Rhyme);
};