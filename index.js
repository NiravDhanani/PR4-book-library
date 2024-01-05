const express = require('express');
const port = 8000;
const app = express();
const db = require('./config/db');
const user = require('./models/user');
app.use(express.urlencoded());



// multer /////////////////
const multer =require('multer');
const fs = require('fs');
const path = require('path');

app.use('/uploads',express.static(path.join('uploads')));

const fileUpload = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"uploads");
    },
    filename : (req,file,cb)=>{
        cb(null, file.originalname);
    }
})
const imageUpload = multer({ storage: fileUpload }).single('avatar');

//multer ///////////////////////////////
app.use('asset/',express.static('asset'));
app.set ('view engine','ejs');

app.get('/',(req,res)=>{
   
   user.find({})
   .then((record)=>{
    return res.render('index',{record});
   }).catch((err)=>{
    console.log(err);
    return false;
})
})

app.get('/form',(req,res)=>{
    return res.render('form');
})

app.post('/addData',imageUpload,(req,res)=>{
    const {name,price,pages,authore} = req.body;
    if(!name || !price || !pages || !authore || !req.file ){
        console.log('all field require');
        return res.redirect('back');
    }
 
    user
    .create({
        name,price,pages,authore,image: req.file.path 
    })
    .then((success)=>{
        console.log('Data add successfully');
        return res.redirect('back');
    }).catch((err)=>{
        console.log('try again');
        return false;
    })
})

app.get('/deleteData',(req,res)=>{
    let id = req.query.id;
    user.findById(id)
    .then((oldRecord)=>{
        fs.unlinkSync(oldRecord.image);
    }).catch((err)=>{
        console.log(err);
        return false;
    })

    user.findByIdAndDelete(id)
    .then((success)=>{
        console.log('data delete');
        return res.redirect('back')
    }).catch((err)=>{
        console.log(err);
        return false;
    })

})

app.get ('/editData',(req,res)=>{
    let id = req.query.id;
    user.findById(id)
    .then((single)=>{
        return res.render('edit',{
            single
        })
    }).catch((err)=>{
        console.log(err);
        return false;
    })
})
// app.post('/updateData',imageUpload,(req,res)=>{
//     let id = req.body.editid;
//     if(req.file){
//         user.findById(id)
//         .then((oldRecord)=>{
//             fs.unlinkSync(oldRecord.image)
//         }).catch((err)=>{
//             console.log(err);
//             return false;
//         })

//         user.findByIdAndUpdate(id,{
//             name : req.body.name,
//             price : req.body.price,
//             pages : req.body.pages,
//             authore : req.body.authore,
//             image : req.file.path
//         }).then((success)=>{
//             console.log("successfully edit");
//             return res.redirect('/');
//         }).catch((err)=>{
//             console.log(err);
//             return false
//         })
//     }else{
//         user.findById(id)
//         .then((oldRecord)=>{
//             user.findByIdAndUpdate(id,{
//                 name : req.body.name,
//             price : req.body.price,
//             pages : req.body.pages,
//             authore : req.body.authore,
//             image : req.file.path
//             }).then((success)=>{
//                 console.log("successfully edit");
//                 return res.redirect('/');
//             }).catch((err)=>{
//                 console.log(err);
//                 return false
//             })
//         }).catch((err)=>{
//             console.log(err);
//             return false;
//         })
//     }
// })

app.post('/updateData',imageUpload, (req, res) => {
    let id = req.body.editid;

    if (req.file) {
        user.findById(id)
            .then((oldRecord) => {
                fs.unlinkSync(oldRecord.image)
            }).catch((err) => {
                console.log(err);
                return false;
            });
        user.findByIdAndDelete(id, {
            name : req.body.name,
            price: req.body.price,
            pages: req.body.pages,
            authore: req.body.authore,
            image : req.file.path
        }).then((success)=>{
            console.log("successfully edit");
            return res.redirect('/');
        }).catch((err)=>{
            console.log(err);
            return false
        })
    }
    else{
        user.findByIdAndUpdate(id, {
                        name: req.body.name,
                        price: req.body.price,
                        pages: req.body.pages,
                        authore: req.body.authore,
                    }).then((success) => {
                        console.log("successfully edited");
                        return res.redirect('/');
                    }).catch((err) => {
                        console.log(err);
                        return res.redirect('back');
                    });
           
    }
});


app.listen(port,(err)=>{
    if(err){
        console.log('error,page not found');
        return false;
    }
    console.log(`Server start on port ${port}`);
})