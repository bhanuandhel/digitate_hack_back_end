const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment =  require("moment");

const Team = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    createdAt: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss")
      }
});

module.exports = mongoose.model("teams", Team);