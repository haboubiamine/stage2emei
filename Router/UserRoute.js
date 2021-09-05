const Router = require("express").Router();
const bycrpt = require("bcryptjs");
const db = require('./../models')

Router.get('/', async  (req,res)=>{
    await db.User.findAll({ include : {model : db.Dept}}).then((result)=>{
        res.render('Userlist' , {Users : result})
        console.log(result)
    })
})




Router.get('/add', async (req,res)=>{
    await db.Dept.findAll({}).then((result)=>{
        res.render('Useradd' , { Departement : result })
    }).catch((err) => {
        res.render('Useradd' , { Departement : [] })
    }); 
})

Router.get('/update/:id', async (req,res)=>{
    await db.User.findOne({where : {id : req.params.id}}).then( async(result)=>{
        await db.Dept.findAll({}).then((depts)=>{
            res.render('Userupdate' , {user : result , Departement : depts })
        })
       
    }).catch((err) => {
        res.render('Userupdate' , {user : {}})
    }); 
  
})

Router.post('/add', async (req,res)=>{

    console.log(req.body)
    const {email} = req.body
    const {pwd} = req.body

   //check if user exists
  const emailexist = await db.User.findOne({ where: { email: email } });
  if (emailexist) return res.status(201).json({
    message: "Email exists try another one"
  })


  //Hash password
  const salt = await bycrpt.genSalt(10);
  const hashpassword = await bycrpt.hash(pwd, salt);

  // Create new user
  const NewUser = {
    email: email,
    pwd: hashpassword,
    Role: "user",
    DeptId	:  req.body.depart

  }

   await db.User.create(NewUser).then(()=>{
    res.redirect('http://localhost:3000/Users');
   })
})

Router.post('/update/:id', async (req,res)=>{

    console.log(req.body)
    const {email} = req.body
    const {pwd} = req.body

   //check if user exists
 await db.User.findOne({ where: { id: req.params.id } }).then(async(result)=>{
       //Hash password
  const salt = await bycrpt.genSalt(10);
  const hashpassword = await bycrpt.hash(pwd, salt);


  if(email){
    result.email = email
  }
  if(pwd){
    result.pwd = hashpassword
  }

  result.DeptId = req.body.depart

   await result.save().then(()=>{
    res.redirect('http://localhost:3000/Users');
   })
  })


})

Router.post('/auth', async (req,res)=>{
  const {email} = req.body
  const {pwd} = req.body

  //check if user exists
const user = await db.User.findOne({ where: {email : email} })
if (!user) {
  res.redirect('/')
  res.end()
}


//Passwor incorrect
const validpassword = await bycrpt.compare(pwd,user.pwd)
if (!validpassword) {
  res.redirect('/')
  res.end()
}
        req.session.userid = user.id
        req.session.role = user.Role
        req.session.save(function(err) {
        // session saved
        
        if(user.Role === 'user'){
          res.redirect('/accueil')
        }
        if (user.Role === 'admin'){
          res.redirect('/Dept')
        }   

      })
      
     
})


Router.post('/logout', (req,res)=>{
  req.session.destroy(function(err) {
    // cannot access session here
  })
  res.redirect('/')
})


Router.post('/delete/:id',async (req,res)=>{
  await db.User.findOne({ where : {id : req.params.id}}).then(async(result)=>{
   await result.destroy().then(()=>{
      res.redirect('http://localhost:3000/users');
   })
  })
})
module.exports = Router;