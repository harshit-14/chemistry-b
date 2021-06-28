const Score = require('../model/score');


module.exports=(app)=>{
     app.post('/api/result/marks',(req,res)=>{
         console.log("frf");
     const {email,quizNumber,score}=req.body
     console.log(quizNumber);
     if(!email || !quizNumber || !score)
     {
         return res.status(400).json({msg:"counld not get all fields"});
     } 
     Score.findOne({email})
       .then(user=>{
           if(user)
           {
              // console.log(user);
               Score.find({email,"marks.quizNumber":quizNumber})
               .then(re=>{
                   if(re.length!==0)
                   {
                       return res.status(400).json({msg:"already attempted"});
                   }
                   else
                   {
                    user.marks.push({
                        quizNumber,
                        score
                    })
                    user.save()
                    .then(user=>{
                     return res.status(200).json(user)
                    })
                    .catch(err=>{
                     return res.status(400).json({msg:"not saved"})
                    })
                   }
               })
               .catch(er => {
                   return res.status(400).json({msg:"err a gya"})
               })

          
               
           }
           else{
                  const newScore = new Score ({
                        email,
                        marks:[
                                {
                                  quizNumber,
                                   score
                                }
                        ]
                    })
                    newScore.save()
                       .then(user=>{
                           return res.status(200).json(user);
                       })
                       .catch(err=>{
                           return res.status(400).json({msg:"fervevevev"})
                       })

                 }
       })
       .catch(err=>{
           return res.status(500).json(err);
       })
     })
   
     app.get('/api/result/getscore',(req,res)=>{
         const email = req.header('email')
       
         Score.findOne({email})
         .then(user=>{
              if(!user)
              {
               return  res.status(400).json({msg:"could not find the score"})
              }
              else{
                return res.status(200).json(user);
              }
         })
         .catch(err=>{
             return res.status(400).json({msg:"could not find"});
         })
     })
}