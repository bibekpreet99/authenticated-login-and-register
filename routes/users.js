const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
// login
router.get('/login', (req,res)=>{res.render('login')})

// register

router.get('/register', (req,res)=>{res.render('register')})

// mongodb model

const User = require('../models/Users')

// register handle 

router.post('/register', (req,res)=>{
    const { name, email, password, password2 } = req.body
    let errors = []

    // check for empty fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'All fields must be filled'})
    }

    // check for password match

    if(password !== password2){
        errors.push({msg: 'Password did not match'})
    }


    // pass length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters long'})
    }

    if(errors.length >0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        // validation passed
        User.findOne({email: email}).then(
            user => {
                if(user){
                    // user exists
                    errors.push({msg: 'Email already exists'})
                    if(errors.length >0){
                        res.render('register',{
                            errors,
                            name,
                            email,
                            password,
                            password2
                        })
                    }
                    
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // password hash
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        // set password to hashed

                        newUser.password = hash
                        // save User
                        newUser.save().then(user=>{
                            req.flash('success_msg', 'You have successfully registered. You can log in now')
                            res.redirect('/users/login')
                        }).catch(err=>console.log(err)
                        )
                    }))
                    
                }
            }
        )
    }
})

// login handle

router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req,res,next)
})

// logout handle

router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success_msg', "You have been successfully logged out")
    res.redirect('/users/login')
})
module.exports = router