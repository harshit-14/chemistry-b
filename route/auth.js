require('dotenv').config();
const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports=(app)=>{
    
    //register route

    app.post('/api/auth/register',(req,res)=>{
    const {name,email,password} = req.body
     if(!name || !email || !password)
     {
         return res.status(400).json({msg:'please enter all fields'})
     }
       User.findOne({email})
         .then(user=>{
             if(user)
             {
                return res.status(400).json({msg :'user already exist'}) 
             }
             else
             {
                 const newUser = new User({
                     name,
                     email,
                     password
                 })
                    bcryptjs.genSalt(10,(err,salt)=>{
                    bcryptjs.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;

                        newUser.password=hash;
                        newUser.save()
                           .then(user=>{
                             jwt.sign(
                                
                                     {id:user.id},
                                     process.env.jwtSecret,
                                     {expiresIn:7*3600},
                                     (err,token)=>{
                                         if(err) throw err

                                         res.json({
                                             token,
                                             user:{
                                                 id:user.id,
                                                 name:user.name,
                                                 email:user.email,
                                             }
                                         })
                                     }
                             )
                           })
                           .catch(err=>{
                                 return res.status(500).json(err);
                           })
                    })
                })
             }
             
         })
         .catch(err=>{
             return res.status(500).json(err)
         })

    })

    //login route

    app.post('/api/auth/login',(req,res)=>{
        
        const {email,password} = req.body
        if(!email || !password)
        {
            res.status(400).json({msg:"pls fill all fields"})
        }

        User.findOne({email})
        .then(user=>{
            if(!user)
            {
                return res.status(400).json({msg:"no user exist"})
            }
            //comparing user detail
            else{
                bcryptjs.compare(password,user.password)
                .then(isMatch=>{
                    if(!isMatch)
                    {
                        return res.status(400).json({msg:"Invalid user"})
                    }
                    else
                    {
                        jwt.sign(
                            {id:user.id},
                            process.env.jwtSecret,
                            {expiresIn:7*3600},
                            (err,token)=>{
                                if(err) throw err;
                               
                                res.json({
                                    token,
                                    user:{
                                        id:user.id,
                                        name:user.name,
                                        email:user.email
                                    }
                                })
                            }
                        )
                    }
                   
                })
            }
        })
    })


   app.get('/api/auth/getUser',async (req,res)=>{
     const token=req.header('x-auth-token');
     if(!token)
     {
         return res.status(400).json({msg:"unauthrized user"});
     }
     else
     {
         try{
             const decoded = await jwt.verify(token,process.env.jwtSecret);
             console.log(decoded)
             User.findById(decoded.id)
               .select('-password')
               .then(user=>res.status(200).json(user))
               .catch(err=>res.json(err))
         }
         catch(e)
         {
             res.status(400).json({msg:"token is not verified"})
         }
     }
   })
}