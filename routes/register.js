const router = require('express').Router();
var connection = require('../app')

router.get('/register',(req,res)=>
{
    if (req.session.loggedin == true)
    {
        res.redirect('/student/student-dashboard');
    }
    else{
    res.render('register')
    }

})




module.exports= router;