const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cors());

mongoose.connect(process.env.MONGO_URL,{useUnifiedTopology:true,useNewUrlParser: true })
.then(()=>{
    console.log("data base is connected")
})
.catch((err)=>{
    console.log(err)
})




app.get('/',(req,res)=>{
    res.send("gfergferfr")
});


require('./route/auth')(app);
require('./route/result')(app);



app.listen(process.env.PORT || 5000);