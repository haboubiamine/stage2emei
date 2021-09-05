const express = require('express');
const Router = express.Router();
const db = require('./../models')

Router.get('/', async (req,res)=>{
    console.log(req.session)
    await db.Dept.findAll({}).then((result)=>{
        res.render('DepartList' , { Departement : result })
    }).catch((err) => {
        res.render('DepartList' , { Departement : [] })
    }); 
})


Router.get('/add', (req,res)=>{
    res.render('Deptadd')
})

Router.get('/delete/:id', (req,res)=>{
    res.render('Deptdelete' , {id: req.params.id})
})

Router.get('/update/:id', async (req,res)=>{
    await db.Dept.findOne({where : {id : req.params.id}}).then((result)=>{
        res.render('Deptupdate' , { Dept : result })
    }).catch((err) => {
        res.render('Deptupdate' , { Dept : {} })
    }); 
})

Router.post('/delete/:id',async (req,res)=>{
    await db.Dept.findOne({ where : {id : req.params.id}}).then(async(result)=>{
     await result.destroy().then(()=>{
        res.redirect('http://localhost:3000/Dept');
     })
     
    })
})

Router.post('/add', async (req,res)=>{
const {dept_name} = req.body
const newdept = {
    dept_name : dept_name
}
await db.Dept.create(newdept).then( async ()=>{
    await db.Dept.findAll({}).then((result)=>{
        res.render('DepartList' , { Departement : result })
    })
}).catch((err) => {
    res.send(err)
});  
})


Router.post('/post/:id', async (req,res)=>{
    const {dept_name} = req.body
    await db.Dept.findOne({ where : {id : req.params.id}}).then(async(result)=>{
        result.dept_name = dept_name
        await  result.save().then(()=>{
            res.redirect('http://localhost:3000/Dept');
        })
    })
})
module.exports = Router;