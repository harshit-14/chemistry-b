const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Mongoose.now()
    }
})

module.exports = Mongoose.model('User',userSchema);