const router = require('express').Router();
var connection = require('../app')
const alert = require('alert');
var fs = require('fs'); 

router.get('/',(req,res)=>{
res.render('img')
})

router.post('/img',(req,res)=>
{
    var txt=req.body.txt;
    connection.query('INSERT INTO link values(?)',[txt])
    .then(results=>
        {
            console.log(results)
        })
    
   
})

router.get('/img',(req,res)=>
{
    connection.query('select * from link')
    .then(results=>
        {
            console.log(results[0].lnk)
            res.render('but',{lnk:results[0].lnk})
        })   
    
})












// router.post("/img",multer({ dest: './public/uploads/'}).single('file'));




module.exports = router;