const router = require('express').Router();
var { name } = require('./signup')
var connection = require('../app');
const signup = require('./signup');
let n;

// let sem;
router.get('/',(req,res)=>
{
	res.render('info',{text:name})
})
// console.log(name(name));



router.post('/',function(request, response) {
	var name = (request.body.name);
	var usn = (request.body.usn);
	var email = (request.body.email);
	var phone = (request.body.phone);
	var bid = (request.body.subject);
	var dob = (request.body.dob);
	let sem = (request.body.sem);
	console.log(sem)
	// sem = 6;
	var password = (request.body.password);
	if (name && email && password) {
		// connection.query('INSERT INTO student values (?,?,?,?,?,?,?)',[usn,name,email,sem,dob,bid,phone])
		// connection.query('INSERT INTO student VALUES(?,?,?,?,?,?,?)',['4cb19','uddd','ss@gmal.com',6,'2001-08-07','mech',87878])			
		connection.query('INSERT INTO student VALUES(?,?,?,?,?,?,?)',[usn,name,email,sem,dob,bid,phone])			
		.then(results => {
				console.log(results);
				response.redirect('/student/success')
				

				

			})


	}
	else {
		result.send("no details entered")
	}

})


// console.log(name)


module.exports = router;