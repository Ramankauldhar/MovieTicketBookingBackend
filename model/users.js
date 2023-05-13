const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullName:{
            type:String
        },
        email:{
            type:String, unique: true
        },
        pswd:{
            type:String, required: true
        },
        created_at:{
            type:Number, default: Date.now().valueOf()
        },
        updated_at:{
            type:Number, default: Date.now().valueOf()
        }
    }
)

module.exports = mongoose.model('Users', userSchema);