const router = require('express').Router();
var connection = require('../app')
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.get('/register', (req, res) => {
    if (req.session.loggedin == true) {
        res.redirect('/manager/manager-dashboard')
    }
    else {
        res.render('mregister')
    }
})

router.post('/signup', (req, res) => {
    var cid = req.body.cid;
    var cname = req.body.cname;
    var mname = req.body.mname;
    var password = req.body.password;


    if (cid && mname && password) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            connection.query('INSERT INTO cauth values (?,?,?,?)', [cid, mname, hash, cname])
                .then(results => {
                    // console.log(results);
                    res.render('minfo', { name: mname, cname: cname })
                    // res.send("success!!!");


                })
        })


    }
    else {
        res.send("no details entered")
    }
})


router.get('/details', (req, res) => {
    res.render('minfo')
})






router.post('/detail', function (request, response) {
    var cname = (request.body.cname);
    var mname = (request.body.mname);
    var vac = (request.body.vacancies);
    let loc = (request.body.loc);
    var jtitle = (request.body.jtitle);
    var special = (request.body.specialization);
    if (cname && mname && vac && loc && jtitle && special) {

        connection.query('INSERT INTO company VALUES(?,?,?)', [cname, loc, mname])
        connection.query('INSERT INTO job_category VALUES(?,?,?,?)', [jtitle, vac, cname, 'temp'])
            .then(results => {
                connection.query('INSERT INTO job_specialization VALUES(?,?,?)', [jtitle, special,cname])
                console.log(results);
                // response.redirect('/manager/signup/success')
                response.render('step3', { jobtitle: jtitle })




            })


    }
    else {
        response.send("no details entered")
    }

})

router.get('/step3', (req, res) => {
    res.render('step3')
})

router.post('/step3', (request, response) => {
    var title = (request.body.s3title);
    var desc = (request.body.s3desc);
    // connection.query("update job_category set job_description='"+desc+"' where job_title='"+title+"'")	
    connection.query('update job_category set job_description= ? where job_title= ?', [desc, title])
        .then(results => {


            console.log(results)
            console.log("update success!!!");
            response.redirect('/manager/signup/success')

        })
})






router.get('/signup/success', (req, res) => {
    res.render('msignupsuccess')
})



// router.post('/mlogin', function (request, response) {
//     var cid = (request.body.clid);
//     var password = (request.body.clpassword);
//     connection.query('SELECT password from cauth where cid=?', [cid])
//         .then(ress => {

//             hash = ress[0].password;
//             console.log(password)
// console.log(hash)

//             bcrypt.compare(password, hash, function (err, result) {
//                 console.log(result)
//                 if (result == true) {

// console.log("success")
//                     connection.query('SELECT * FROM cauth WHERE cid = ?', [cid])
//                         .then(results => {
//                             // hash = dat[0].password;
//                             if (results.length > 0) {
//                                 // console.log(results)
//                                 request.session.loggedin = true;
//                                 request.session.username = cid;
//                                 response.redirect('/manager/manager-dashboard')
//                             }
//                             else {
//                                 response.send('Incorrect Username and/or Password!');
//                             }
//                             response.end();
//                         })



//                 } else {
//                     response.send('Please enter Username and Password!');
//                     response.end();
//                 }
//             })
//         })
// })



router.post('/mlogin', function (request, response) {
    var cid = (request.body.clid);
    var password = (request.body.clpassword);
    if (cid && password) {

        connection.query('SELECT * FROM cauth WHERE cid = ?', [cid])
        .then(reslts => {

            if (reslts.length > 0) {
                    connection.query('SELECT password FROM cauth WHERE cid = ?', [cid])
                        .then(ress => {
                

                            hash = ress[0].password;


                            bcrypt.compare(password, hash, function (err, result) {
                                if (result == true) {

                                    connection.query('SELECT * FROM cauth WHERE cid = ?', [cid])
                                        .then(results => {

                                            if (results.length > 0) {
                                                // console.log(results)
                                                request.session.loggedin = true;
                                                request.session.username = cid;
                                                response.redirect('/manager/manager-dashboard')



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
                        }, err => {
                            response.send("No such user found")
                        });
                    }
                    else{
                        response.send("No Such User Found!!! ")
                    }})
                }
                
        

             else {
                response.send('Please enter Username and Password!');
                response.end();
            }


})


// login------------------

router.get('/manager-dashboard', (req, res) => {
    if (req.session.loggedin == true) {
        connection.query('SELECT manager_name FROM cauth WHERE cid = ? ', [req.session.username])
            .then(result => {
                if (result.length > 0) {
                    // console.log("logged in as: " + result[0])
                    console.log("logged in as:" + result[0].manager_name)
                    connection.query('select *  from student,branch where B_id=Bid and usn in(select usn from applies_for where job_title in(select job_title from job_category where comp_name in (SELECT company FROM cauth WHERE cid = ? )))', [req.session.username])
                        .then(records => {
                            // console.log(records)
                            connection.query('SELECT company from cauth where cid=(?)', [req.session.username])
                                .then(resss => {
                                    res.render('manager-dashboard', { username: result[0].manager_name, records: records, cmp: resss[0].company })

                                })






                        }
                        )
                }
            })
    }
    else {
        res.send("Please login to continue")
    }
    // select *  from student where usn in(select usn from applies_for where job_title in(select job_title from job_category where comp_name='gulugulu'))

})

router.get('/delete-profile', (req, response) => {
    connection.query('select company from cauth where cid=(?)', [req.session.username])
        .then(res => {
            connection.query('delete from company where Comp_name=(?)', [res[0].company])
                .then(ress => {
                    connection.query("delete from cauth where cid=(?)", [req.session.username])
                        .then(resss => {
                            req.session.destroy();
                            response.send("Profile Deleted!!!")
                        })
                })
        })
})


router.get('/forget', (req, response) => {
    response.render('mforget')
   
})



router.post('/forget', (req, res) => {
    var email=req.body.email;
    var mname=req.body.mname;
    var password=req.body.password;
    connection.query('select * from cauth where cid=(?) AND manager_name=(?)',[email,mname])
    .then(results=>
        {
            if(results.length>0)
            {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                // Store hash in your password DB.
    
    
                connection.query('update cauth set password=(?) where cid=(?)',[hash,email])
                .then(ress=>
                    {
res.send("Password Updated Successfully")
                    })
                })
            
        }
    
    else{
res.send("invalid credentials")
    }
 
})
})

router.post('/sinfo', (req, res) => {
    var usn = req.body.usn;
    connection.query('select * from student where Usn=(?)', [usn])
        .then(results => {
            if (results.length > 0) {
                connection.query('select * from sinfo where usn=?', [usn])
                    .then(result => {
                        if (result.length > 0) {
                            res.render('studentinfo', { student: results, sinfo: result })
                        }
                    })
            }
        })
})


router.post('/shortlist', (req, res) => {
    var usn = req.body.short;

    connection.query('SELECT j.Job_title,j.comp_name FROM job_category j,cauth c WHERE j.comp_name=c.company and c.cid = ? ', [req.session.username])
        .then(results => {


            connection.query('INSERT INTO shortlisted values(?,?,?)', [usn, results[0].comp_name, results[0].Job_title])
                .then(ress => {
                    console.log(ress);
                    res.send("shortlisted :)")

                }, error => {
                    res.send("Already Shortlisted :(")
                })

        })


})


router.get('/studentinfo', (req, res) => {
    res.render('studentinfo')

})




// login ends---------------
router.get('/logout', (req, res) => {
    req.session.destroy();
    console.log("logged out")
    res.redirect('/manager/register');

})


module.exports = router;