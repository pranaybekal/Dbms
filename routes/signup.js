const bcrypt = require('bcryptjs');
const saltRounds = 10;
const router = require('express').Router();
var connection = require('../app')
const Swal = require('sweetalert2')
// import swal from 'sweetalert';
var name;
var count = 0;
// ------------------------------------------------------------------------------
// signup




router.post('/signup', function (request, result) {
    var email = (request.body.semail);
    var password = (request.body.spassword);
    var password2 = (request.body.spassword2);
    name = (request.body.sname);
    console.log(name)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;  
const found = password.match(regex);
console.log(found);
connection.query('select * from auth where email=(?)',[email])
.then(resss=>
    {
if(resss.length<=0)
{
    
    if (email && password && found!=null && name &&password==password2) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.


            connection.query('INSERT INTO auth values (?,?,?)', [email, hash, name])
                .then(results => {
                    console.log(results);
                    // result.redirect('/info');
                    result.render('info', { name: name, email: email, password: password });


                })


        });
    }
    else if(found==null)
    {
        result.send("Password must be of 8 characters and there should be atleast 1 capital letter and 1 number, no special characters are allowed")
    }
    else if(password!=password2)
    {
        result.send("Password and confirm password doesn't match")
    }
    else {
        result.send("no details entered")
    }
}
else
{
result.send("User with that mail already exists!")
}
})

})















// --------------------------------------------------------------------------------------
// login route



router.post('/login', function (request, response) {
    var username = (request.body.lemail);
    var password = (request.body.lpassword);
    if (username && password) {
        connection.query('SELECT * FROM auth WHERE email = ?', [username])
            .then(reslts => {

                if (reslts.length > 0) {

                    connection.query('SELECT password FROM auth WHERE email = ?', [username])
                        .then(dat => {


                            // console.log(dat[0].password);




                            
                                bcrypt.compare(password, dat[0].password, function (err, result) {
                                    if (result == true) {

                                        connection.query('SELECT * FROM auth WHERE email = ?', [username])
                                            .then(results => {

                                                if (results.length > 0) {
                                                    // console.log(results)
                                                    request.session.loggedin = true;
                                                    request.session.username = username;
                                                    response.redirect('/student/student-dashboard')



                                                }

                                                else {
                                                    response.send('Incorrect Username and/or Password!');
                                                }
                                                response.end();
                                            })

                                    }
                                    else {
                                        response.send('Incorrect Username and/or Password!');
                                    }
                                })
                        
                           
                        });

                } else {
                    response.send('No Such User Found!!!');
                    response.end();
                }

            })
    }

})


router.get('/sinfo', (req, res) => {
    connection.query('select * from student where email=?', [req.session.username])
        .then(result => {
            // console.log(result[0].Usn)
            res.render('student-info', { usn: result[0].Usn })
        })

})


router.post('/sinfo', (req, res) => {
    var usn = req.body.usn;
    var locality = req.body.locality;
    var course = req.body.course;
    var aadhar = req.body.aadhar;
    var college = req.body.college;
    var desc = req.body.desc;
    var resume = req.body.resume;



    connection.query("INSERT INTO sinfo values(?,?,?,?,?,?,?)", [usn, locality, course, aadhar, college, desc, resume])
        .then(results => {
            count = 1;
            // console.log(results)
            res.redirect('/student/student-dashboard')
        }, error => {
            // console.log(error)
            count = 2;
            connection.query("Update sinfo set locality=(?),course=(?),aadhar=(?),college=(?),description=(?),resume=(?) where usn=(?)", [locality, course, aadhar, college, desc, resume, usn])
                .then(resu => {

                    res.redirect('/student/student-dashboard')


                })
        })
})

router.get('/delete-profile', (req, res) => {
    connection.query("delete from student where Email=(?)", [req.session.username])
        .then(ress => {
            connection.query("delete from auth where email=(?)", [req.session.username])
                .then(resq => {
                    req.session.destroy();
                    res.send("Profile Deleted Successfully")
                })

        })

})


router.get('/student-dashboard', (req, res) => {
    if (req.session.loggedin == true) {
        connection.query('SELECT Name FROM student WHERE email = ? ', [req.session.username])
            .then(result => {
                if (result.length > 0) {
                    console.log("logged in as: " + result[0].Name)
                    // res.render('student-dashboard', { username: results[0].Name })
                    connection.query('SELECT * FROM company')
                        .then(results => {
                            if ((results.length >= 0)) {
                                console.log(results)

                                connection.query('SELECT * FROM job_category ')
                                    .then(category => {
                                        if (category.length >= 0) {
                                            // console.log(category)
                                            connection.query('SELECT * FROM job_specialization')
                                                .then(special => {
                                                    if (special.length >= 0) {
                                                        connection.query('SELECT Usn FROM student WHERE email = ? ', [req.session.username])
                                                            .then(usn => {
                                                                connection.query('select * from shortlisted where usn=(?)', usn[0].Usn)
                                                                    .then(short => {

                                                                        connection.query('select * from  company c,shortlisted s where c.Comp_name=s.Cmp_name and usn=(?)', usn[0].Usn)
                                                                            .then(cdata => {
                                                                                // console.log(records.length);
                                                                                res.render('student-dashboard', { username: result[0].Name, records: category, cat: category, special: special, usn: usn[0].Usn, jcount: category.length, short: short, cdata: cdata, count: count })
                                                                            })
                                                                    }


                                                                    )
                                                            })


                                                        // console.log(special)

                                                    }
                                                })

                                        }
                                    })
                            }


                        })



                }

            })
        // res.render('student-dashboard')
    }
    else {
        res.send("Please login to continue")
    }

})

router.get('/forget', (req, res) => {
    res.render('forget')

})

router.post('/forget', (req, res) => {
    var email=req.body.email;
    var phone=req.body.phone;
    var password=req.body.password;
    connection.query('select * from student where Email=(?) AND Phone=(?)',[email,phone])
    .then(results=>
        {
            if(results.length>0){
            bcrypt.hash(password, saltRounds, function (err, hash) {
                // Store hash in your password DB.
    
    
                connection.query('update auth set password=(?) where email=(?)',[hash,email])
                .then(ress=>
                    {
res.send("Password Updated Successfully")
                    })
                })
            }
            else
            {
                res.send("Invalid credentials")
            }
        })
    
    
})



router.get('/logout', (req, res) => {
    req.session.destroy();
    console.log("logged out")
    res.redirect('/register');

})



router.post('/apply', (req, res) => {
    titleusn = req.body.h;
    // usn='4cb19cs112';


    if (titleusn) {
        console.log(titleusn)

        connection.query('INSERT INTO applies_for values  (' + titleusn + ')')
            .then(results => {
                count = 3;
                console.log(results);
                res.redirect('/student/student-dashboard')




            }, error => {
                count = 4;
                res.redirect('/student/student-dashboard')
            })



    }
    else {
        res.send("no details entered")
    }
})




router.get('/success', (req, res) => {
    res.render('signupsuccess')
})

module.exports = router;
