
module.exports = (req,res,next)=>{
    console.log(req.session)
    if(!req.session.userid){
        res.redirect('http://localhost:3000');
    }else{
        next()
    }
   
};
