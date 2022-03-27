const router = require('express').Router();
var connection = require('../app')

router.get('/register',(req,res)=>
{
    if (req.session.loggedin == true)
    {
        count=100;
        res.redirect('/student/student-dashboard');
    }
    else{
        count=100;
    res.render('register',{count : count})
    }

})




module.exports= router;