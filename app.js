const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

mongoose.Promise = global.Promise

// passport config
require('./config/passport')(passport);


// EJS

app.use(expressLayouts)
app.set('view engine', 'ejs')


// bodyparser

app.use(express.urlencoded({extended: false}))

// Express session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())



// connect flash
app.use(flash())

// global vars

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})

// mongo db
const db = require('./config/keys').url;

mongoose.connect(db, { useNewUrlParser: true })
    .then(()=>{console.log('mongodb connected');
    })
    .catch(err=> console.log(err)
    )


const PORT = process.env.PORT || 5000;

// routes
app.use('/', require('./routes/index'))

// users
app.use('/users', require('./routes/users'))


















app.listen(PORT, console.log(`you are listening on port ${PORT}`))


