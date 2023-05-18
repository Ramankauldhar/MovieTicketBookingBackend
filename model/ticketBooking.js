const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        email:{
            type:String, unique: true
        },
        movieTitle:{
            type:String, required: true
        },
        showTime:{
            type:String, required: true
        },
        noOfTickets:{
            type:Number, required:true
        },
        totalPrice:{
            type:Number, required:true
        },
        seats:{
            type:[], required:true
        },
        created_at:{
            type:Number, default: Date.now().valueOf()
        }
    }
)

module.exports = mongoose.model('ticketBookingInfo', bookingSchema );