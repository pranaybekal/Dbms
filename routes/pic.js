const router = require('express').Router();
var connection = require('../app')
const alert = require('alert');


router.get('/',(req,res)=>
{
    res.render('pic');
})




module.exports = router;