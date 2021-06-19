const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment =  require("moment");

const Chat = new Schema({
    message:{
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    team:{
        type:Schema.Types.ObjectId,
        ref:'teams'
    },
    createdAt: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss")
      }
});

module.exports = mongoose.model("chats", Chat);