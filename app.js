// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan');
const db = require('./models')
var session = require('express-session')
const app = express()
const port = 3000

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/Images', express.static(__dirname + 'public/Images'))
app.use(express.static('uploads/'));
app.use('/Tools', express.static(__dirname + 'Tools/dropzone-5.7.0/dist'))

//Router 
const Userroute = require('./Router/UserRoute');
const DeptRoute = require('./Router/DeptRoute');
const FileRouter = require('./Router/FileRouter');

//midellware
const auth = require('./Midellware/authentification')
const Isadmin = require('./Midellware/Isadmin')

// DB Config
try {
    db.sequelize.sync();
  } catch (error) {
    console.log(error)
  }

// middleware
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/sidebar')
app.set('view engine', 'ejs')

//session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// Routes
app.get('', (req, res) => {
    res.render('index', { title: 'Home Page' , layout : 'layouts/full-width.ejs'})
})

app.get('/accueil', async  (req,res)=>{
  await db.User.findOne({where :{ id : req.session.userid} , include : {model : db.Dept , include : {model : db.File}}}).then((result)=>{
    res.render('Userpage', { Data : result.Dept.Files , layout : 'layouts/full-width.ejs'})

  }) 
})

// app.use('/users',auth,Isadmin,Userroute)
// app.use('/Dept',auth,Isadmin,DeptRoute)
// app.use('/File',auth,Isadmin,FileRouter)

app.use('/users',Userroute)
app.use('/Dept',DeptRoute)
app.use('/File',FileRouter)

// Listen on Port 3000
app.listen(port, () => console.info(`App listening on port ${port}`))