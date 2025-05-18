import mongoose, { model } from "mongoose";

const userSchema = mongoose.Schema({
	name : {
		type: String,
		required : true
	},
	email : {
		type: String,
		required : true
	},
	password : {
		type: String,
		required : true
	}
})

export default model("User",userSchema)