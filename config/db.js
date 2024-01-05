const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/book-library');
const db = mongoose.connection;                     

db.on('connected',(err)=>{
    if(err){
        console.log(`Db not found`);
        return false;
    }
    console.log(`db connected`);
});