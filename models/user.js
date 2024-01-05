const mongoose = require('mongoose');
const userModel = mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    price : {
        type : String,
        require : true,
    },
    pages : {
        type : String,
        require : true,
    },
    authore : {
        type : String,
        require : true,
    },
    image : {
        type : String,
        require : true,
    },

});
const user = mongoose.model('user',userModel);
module.exports = user;