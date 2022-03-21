const router = require('express').Router();
var connection = require('../app')
const alert = require('alert');



function getdata()
{
    console.log("hi")
}



router.post('/',(req,res)=>
{
    titleusn=req.body.h;
        // usn='4cb19cs112';


 if(titleusn)
    {
        console.log(titleusn)
        
        connection.query('INSERT INTO applies_for values  ('+titleusn+')')
        .then( results=>{
            console.log(results);
            // res.render('minfo',{name:mname})
            // alert("success!!!")
            res.send("success!!!");
            
            

        },error=>{
            res.send("already applied!!!")
        })
       
      

    }
    else{
        res.send("no details entered")
    }
})




module.exports = router;
