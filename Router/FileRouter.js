const express = require('express');
const Router = express.Router();
const db = require('./../models')
const { promisify } = require('util')
const fs = require("fs")
var multer  = require('multer')
const unlink = promisify(fs.unlink)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads")
  },
  filename: function (req, file, cb) {
      const parts = file.mimetype.split("/");
      cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }
})

const upload = multer({storage});


Router.get('/', async (req,res)=>{
  await db.File.findAll({include : {model : db.Dept}}).then((result)=>{
    res.render('Filelist' , { Files : result })
}).catch((err) => {
    res.render('Filelist' , { Files : [] })
}); 
})


Router.post('/delete/:id',async (req,res)=>{
  await db.File.findOne({ where : {id : req.params.id}}).then(async(result)=>{
   await result.destroy().then(()=>{
      res.redirect('http://localhost:3000/file');
   })
   
  })
})

Router.get('/add', async (req,res)=>{ 

  await db.Dept.findAll({}).then((result)=>{
    res.render('Fileadd' , { Departement : result })
}).catch((err) => {
    res.render('Fileadd' , { Departement : [] })
}); 
})

Router.get('/update/:id', async (req,res)=>{ 

  await db.File.findOne({where :{id : req.params.id}, include : {model :db.Dept }}).then(async(file)=>{
    await db.Dept.findAll({}).then((dept)=>{
      res.render('FileUpdate' , { File : file , Departement : dept})
  })
}).catch((err) => {
    res.render('FileUpdate' , { File : {}, Departement : [] })
}); 
})


Router.post('/upload',upload.single("file"),async(req,res)=>{
console.log(req.file)

const url = `http://${req.hostname}:${process.env.PORT || 3000}/${req.file.filename}`
const path = req.file.path

const newfile = {
  file_name : req.file.originalname,
  url : url,
  path : path,
  DeptId: req.body.depart
}

await db.File.create(newfile).then(()=>{
  res.redirect('http://localhost:3000/File');
})

})

Router.post('/update/upload/:id',upload.single("file"),async(req,res)=>{
  console.log(req.file)

 

  await db.File.findOne({where :{ id: req.params.id}}).then(async(file)=>{

    if(req.file){
      await unlink(file.path)
      const url = `http://${req.hostname}:${process.env.PORT || 3000}/${req.file.filename}`
      const path = req.file.path
      file.url = url
      file.path = path
      file.file_name = req.file.originalname
    }
    
    file.DeptId = req.body.depart
    await file.save().then(()=>{
      res.redirect('http://localhost:3000/File');
    })
  })
  
  })

module.exports = Router;