
module.exports = (req,res,next)=>{
    console.log(req.session)
    
    if(req.session.role === 'admin'){
        next()
    }else{  
        res.redirect('http://localhost:3000');
    }
   
};
